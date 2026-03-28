#!/usr/bin/env bash
# =============================================================================
# SafetyVoice UK — VPS Deployment Script
# Detects OS, installs dependencies, sets up PostgreSQL, builds, and starts the app.
# Run as root or with sudo on a fresh VPS.
# =============================================================================
set -euo pipefail

APP_NAME="safetyvoice-uk"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_PORT=8080
NODE_VERSION="20"

# -----------------------------------------------------------------------------
# Colour helpers
# -----------------------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# -----------------------------------------------------------------------------
# 1. Detect OS
# -----------------------------------------------------------------------------
detect_os() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS_ID="${ID:-unknown}"
    OS_ID_LIKE="${ID_LIKE:-}"
  elif [ "$(uname)" = "Darwin" ]; then
    OS_ID="macos"
  else
    error "Cannot detect OS. Supported: Ubuntu/Debian, RHEL/CentOS/Fedora/AlmaLinux, Arch, macOS."
  fi

  # Normalise to a family
  case "$OS_ID" in
    ubuntu|debian|linuxmint|pop)      OS_FAMILY="debian" ;;
    rhel|centos|almalinux|rocky|ol)   OS_FAMILY="rhel" ;;
    fedora)                           OS_FAMILY="fedora" ;;
    arch|manjaro|endeavouros)         OS_FAMILY="arch" ;;
    macos)                            OS_FAMILY="macos" ;;
    *)
      # Try ID_LIKE as fallback
      if echo "$OS_ID_LIKE" | grep -q "debian"; then OS_FAMILY="debian"
      elif echo "$OS_ID_LIKE" | grep -q "rhel\|centos\|fedora"; then OS_FAMILY="rhel"
      else error "Unsupported OS: $OS_ID. Open an issue or install Node.js + PostgreSQL manually."
      fi
      ;;
  esac

  info "Detected OS: ${OS_ID} (family: ${OS_FAMILY})"
}

# -----------------------------------------------------------------------------
# 2. Install Node.js (via NodeSource for Linux, Homebrew for macOS)
# -----------------------------------------------------------------------------
install_nodejs() {
  if command -v node &>/dev/null; then
    CURRENT_NODE=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$CURRENT_NODE" -ge "$NODE_VERSION" ]; then
      info "Node.js $(node -v) already installed — skipping."
      return
    fi
    warn "Node.js $(node -v) found but version ${NODE_VERSION}+ required. Upgrading..."
  fi

  info "Installing Node.js ${NODE_VERSION}.x ..."
  case "$OS_FAMILY" in
    debian)
      apt-get update -qq
      apt-get install -y curl ca-certificates
      curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
      apt-get install -y nodejs
      ;;
    rhel)
      dnf install -y curl
      curl -fsSL "https://rpm.nodesource.com/setup_${NODE_VERSION}.x" | bash -
      dnf install -y nodejs
      ;;
    fedora)
      dnf install -y curl
      curl -fsSL "https://rpm.nodesource.com/setup_${NODE_VERSION}.x" | bash -
      dnf install -y nodejs
      ;;
    arch)
      pacman -Sy --noconfirm nodejs npm
      ;;
    macos)
      if ! command -v brew &>/dev/null; then
        error "Homebrew not found. Install it from https://brew.sh then re-run this script."
      fi
      brew install node@${NODE_VERSION} || brew upgrade node@${NODE_VERSION} || true
      brew link --overwrite --force node@${NODE_VERSION} || true
      ;;
  esac
  info "Node.js $(node -v) installed."
}

# -----------------------------------------------------------------------------
# 3. Install PostgreSQL
# -----------------------------------------------------------------------------
install_postgresql() {
  if command -v psql &>/dev/null; then
    info "PostgreSQL already installed — skipping."
    return
  fi

  info "Installing PostgreSQL ..."
  case "$OS_FAMILY" in
    debian)
      apt-get update -qq
      apt-get install -y postgresql postgresql-contrib
      ;;
    rhel)
      dnf install -y postgresql-server postgresql-contrib
      postgresql-setup --initdb
      ;;
    fedora)
      dnf install -y postgresql-server postgresql-contrib
      postgresql-setup --initdb
      ;;
    arch)
      pacman -Sy --noconfirm postgresql
      sudo -u postgres initdb --locale=en_US.UTF-8 -D /var/lib/postgres/data
      ;;
    macos)
      brew install postgresql@17 || brew upgrade postgresql@17 || true
      brew link --overwrite --force postgresql@17 || true
      export PATH="/usr/local/opt/postgresql@17/bin:/opt/homebrew/opt/postgresql@17/bin:$PATH"
      ;;
  esac

  # Start & enable
  case "$OS_FAMILY" in
    debian|rhel|fedora|arch)
      systemctl enable postgresql
      systemctl start  postgresql
      ;;
    macos)
      brew services start postgresql@17
      ;;
  esac
  info "PostgreSQL installed and running."
}

# -----------------------------------------------------------------------------
# 4. Install Nginx
# -----------------------------------------------------------------------------
install_nginx() {
  if command -v nginx &>/dev/null; then
    info "Nginx already installed — skipping."
    return
  fi

  info "Installing Nginx ..."
  case "$OS_FAMILY" in
    debian)
      apt-get install -y nginx
      systemctl enable nginx
      systemctl start  nginx
      ;;
    rhel)
      dnf install -y nginx
      systemctl enable nginx
      systemctl start  nginx
      ;;
    fedora)
      dnf install -y nginx
      systemctl enable nginx
      systemctl start  nginx
      ;;
    arch)
      pacman -Sy --noconfirm nginx
      systemctl enable nginx
      systemctl start  nginx
      ;;
    macos)
      brew install nginx || true
      brew services start nginx || true
      ;;
  esac
  info "Nginx installed."
}

# -----------------------------------------------------------------------------
# 5. Create .env if it doesn't exist
# -----------------------------------------------------------------------------
setup_env() {
  if [ -f "$APP_DIR/.env" ]; then
    info ".env already exists — skipping template copy."
    return
  fi

  if [ ! -f "$APP_DIR/.env.example" ]; then
    error ".env.example not found in $APP_DIR. Cannot create .env."
  fi

  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  warn "--------------------------------------------------------------"
  warn ".env created from .env.example."
  warn "Edit $APP_DIR/.env and set:"
  warn "  API_KEY        — your Google Gemini API key"
  warn "  DB_PASSWORD    — the PostgreSQL password you will set below"
  warn "  ADMIN_SECRET   — override admin login (default: admin123)"
  warn "--------------------------------------------------------------"
  # Pause so the operator can read the message before the script continues
  read -rp "Press ENTER when you have finished editing .env ..."
}

# -----------------------------------------------------------------------------
# 6. Set up PostgreSQL database & user
# -----------------------------------------------------------------------------
setup_database() {
  # Load .env so we can read DB_* variables
  set -a; source "$APP_DIR/.env"; set +a

  DB_NAME="${DB_NAME:-safetyvoice}"
  DB_USER="${DB_USER:-svadmin}"
  DB_PASSWORD="${DB_PASSWORD:-}"
  DB_HOST="${DB_HOST:-127.0.0.1}"

  if [ -z "$DB_PASSWORD" ]; then
    error "DB_PASSWORD is not set in .env. Please set it and re-run."
  fi

  info "Configuring PostgreSQL database '${DB_NAME}' and user '${DB_USER}' ..."

  # Run as the postgres superuser
  PG_CMD="sudo -u postgres psql"
  if [ "$OS_FAMILY" = "macos" ]; then
    PG_CMD="psql -U $(whoami)"
  fi

  $PG_CMD <<SQL
CREATE DATABASE ${DB_NAME};
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
  END IF;
END \$\$;
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

  # Grant schema-level permissions (needed for PostgreSQL 15+)
  $PG_CMD -d "${DB_NAME}" <<SQL
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
SQL

  info "Importing schema ..."
  if [ "$OS_FAMILY" = "macos" ]; then
    psql -U "$(whoami)" -d "${DB_NAME}" -f "$APP_DIR/schema.sql"
  else
    sudo -u postgres psql -d "${DB_NAME}" -f "$APP_DIR/schema.sql"
  fi

  # Update DATABASE_URL in .env to use PostgreSQL format
  sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT:-5432}/${DB_NAME}|" "$APP_DIR/.env"
  rm -f "$APP_DIR/.env.bak"

  info "Database ready."
}

# -----------------------------------------------------------------------------
# 7. npm install & build
# -----------------------------------------------------------------------------
build_app() {
  info "Installing npm dependencies ..."
  cd "$APP_DIR"
  npm ci --omit=dev

  info "Building frontend ..."
  npm run build
  info "Frontend built to dist/."
}

# -----------------------------------------------------------------------------
# 8a. Set up systemd service (Linux)
# -----------------------------------------------------------------------------
setup_systemd() {
  SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
  # Determine the user running the app (prefer non-root)
  APP_USER="${SUDO_USER:-$(whoami)}"
  NODE_BIN="$(command -v node)"
  NPM_BIN="$(command -v npx)"

  info "Creating systemd service at ${SERVICE_FILE} ..."
  cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=SafetyVoice UK
After=network.target postgresql.service

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
ExecStart=${NPM_BIN} tsx server/server.ts
Restart=on-failure
RestartSec=5
EnvironmentFile=${APP_DIR}/.env
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable  "${APP_NAME}"
  systemctl restart "${APP_NAME}"
  info "systemd service '${APP_NAME}' enabled and started."
}

# -----------------------------------------------------------------------------
# 8b. Set up launchd plist (macOS)
# -----------------------------------------------------------------------------
setup_launchd() {
  PLIST_LABEL="uk.safetyvoice.server"
  PLIST_FILE="${HOME}/Library/LaunchAgents/${PLIST_LABEL}.plist"
  NPM_BIN="$(command -v npx)"

  info "Creating launchd plist at ${PLIST_FILE} ..."
  mkdir -p "${HOME}/Library/LaunchAgents"
  cat > "$PLIST_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>         <string>${PLIST_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${NPM_BIN}</string>
    <string>tsx</string>
    <string>${APP_DIR}/server/server.ts</string>
  </array>
  <key>WorkingDirectory</key> <string>${APP_DIR}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key> <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
  </dict>
  <key>KeepAlive</key>     <true/>
  <key>RunAtLoad</key>     <true/>
  <key>StandardOutPath</key>  <string>${APP_DIR}/logs/server.log</string>
  <key>StandardErrorPath</key><string>${APP_DIR}/logs/server.error.log</string>
</dict>
</plist>
EOF

  mkdir -p "${APP_DIR}/logs"
  launchctl unload "$PLIST_FILE" 2>/dev/null || true
  launchctl load   "$PLIST_FILE"
  info "launchd service '${PLIST_LABEL}' loaded."
}

# -----------------------------------------------------------------------------
# 9. Configure Nginx reverse proxy
# -----------------------------------------------------------------------------
setup_nginx() {
  # Load .env to get domain
  set -a; source "$APP_DIR/.env"; set +a
  DOMAIN="${DOMAIN:-localhost}"

  NGINX_CONF_SRC="$APP_DIR/nginx.conf"
  if [ ! -f "$NGINX_CONF_SRC" ]; then
    warn "nginx.conf not found — skipping Nginx configuration."
    return
  fi

  case "$OS_FAMILY" in
    debian)     NGINX_SITES="/etc/nginx/sites-available"; NGINX_ENABLED="/etc/nginx/sites-enabled" ;;
    rhel|fedora) NGINX_SITES="/etc/nginx/conf.d"; NGINX_ENABLED="" ;;
    arch)       NGINX_SITES="/etc/nginx/sites-available"; NGINX_ENABLED="/etc/nginx/sites-enabled" ;;
    macos)      NGINX_SITES="$(brew --prefix)/etc/nginx/servers"; NGINX_ENABLED="" ;;
    *)          warn "Unknown OS family for Nginx setup — skipping."; return ;;
  esac

  mkdir -p "$NGINX_SITES"
  sed "s|__DOMAIN__|${DOMAIN}|g; s|__APP_PORT__|${APP_PORT}|g; s|__APP_DIR__|${APP_DIR}|g" \
    "$NGINX_CONF_SRC" > "${NGINX_SITES}/${APP_NAME}.conf"

  if [ -n "$NGINX_ENABLED" ]; then
    mkdir -p "$NGINX_ENABLED"
    ln -sf "${NGINX_SITES}/${APP_NAME}.conf" "${NGINX_ENABLED}/${APP_NAME}.conf"
  fi

  nginx -t && (systemctl reload nginx 2>/dev/null || brew services restart nginx 2>/dev/null || true)
  info "Nginx configured for domain: ${DOMAIN}"
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
main() {
  echo ""
  echo "=============================================="
  echo "  SafetyVoice UK — VPS Deployment"
  echo "=============================================="
  echo ""

  detect_os

  # Check for root/sudo on Linux
  if [ "$OS_FAMILY" != "macos" ] && [ "$(id -u)" -ne 0 ]; then
    error "This script must be run as root or with sudo on Linux."
  fi

  install_nodejs
  install_postgresql
  install_nginx

  setup_env
  setup_database
  build_app

  # Install tsx (TypeScript runner) as a dev tool
  info "Ensuring tsx is available ..."
  npm install --save-dev tsx 2>/dev/null || true

  if [ "$OS_FAMILY" = "macos" ]; then
    setup_launchd
  else
    setup_systemd
  fi

  setup_nginx

  echo ""
  echo "=============================================="
  info "Deployment complete!"
  echo ""
  info "Application: http://${DOMAIN:-localhost}:${APP_PORT}"
  info "Nginx proxy: http://${DOMAIN:-localhost}"
  echo ""
  info "Useful commands:"
  if [ "$OS_FAMILY" = "macos" ]; then
    echo "  launchctl list | grep safetyvoice   # check status"
    echo "  tail -f ${APP_DIR}/logs/server.log  # view logs"
  else
    echo "  systemctl status  ${APP_NAME}   # check status"
    echo "  journalctl -u ${APP_NAME} -f    # follow logs"
    echo "  systemctl restart ${APP_NAME}   # restart app"
  fi
  echo "=============================================="
}

main "$@"
