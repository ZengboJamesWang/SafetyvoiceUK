# SafetyVoice UK

An independent platform for sharing anonymised experiences of laboratory safety enforcement, primarily serving UK Higher Education Institutions and open to any research organisation worldwide.

**Stack:** React 19 · Node.js / Express · MariaDB · Google Gemini AI

---

## Supported Operating Systems

| OS Family | Distributions |
|-----------|---------------|
| Debian / Ubuntu | Ubuntu 22.04 / 24.04, Debian 12 |
| RHEL / CentOS | AlmaLinux 9, Rocky Linux 9, CentOS Stream 9 |
| Fedora | Fedora 39+ |
| Arch | Arch Linux, Manjaro |
| macOS | macOS 13+ (Homebrew required) |

---

## Before You Start

You will need:

- A **Google Gemini API key** — free at [aistudio.google.com](https://aistudio.google.com/app/apikey)
- A **VPS or server** with root/sudo access (Ubuntu 22.04+ recommended)
- A **domain name** pointing to your server's IP (optional for local testing, required for public use)

---

## Option A — Automated Deployment (Recommended)

The `deploy.sh` script handles everything: installs Node.js, MariaDB, and Nginx, sets up the database, builds the app, and registers it as a system service that starts on boot.

### Step 1 — Install git and clone the repository

```bash
# Debian / Ubuntu
sudo apt-get update && sudo apt-get install -y git

# RHEL / Fedora
sudo dnf install -y git

# macOS — git comes with Xcode Command Line Tools
xcode-select --install
```

Then clone:

```bash
git clone https://github.com/ZengboJamesWang/SafetyvoiceUK.git
cd SafetyvoiceUK
```

### Step 2 — Open firewall ports (Linux VPS only)

Most VPS providers block ports by default. Open HTTP and HTTPS:

```bash
# Debian / Ubuntu (ufw)
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# RHEL / Fedora (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

> If your VPS provider has a separate network firewall panel (DigitalOcean, Hetzner, AWS Security Groups, etc.), also open ports **80** and **443** there.

### Step 3 — Run the deployment script

```bash
# Linux
sudo bash deploy.sh

# macOS (install Homebrew first if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
bash deploy.sh
```

The script will:
1. Detect your OS and install **Node.js 20+**, **MariaDB**, and **Nginx**
2. Copy `.env.example` → `.env` and **pause** so you can fill in your credentials
3. Create the `safetyvoice` database and import `schema.sql`
4. Run `npm ci` and `npm run build`
5. Register the app as a **systemd** service (Linux) or **launchd** agent (macOS)
6. Write an Nginx reverse-proxy config and reload Nginx

**When the script pauses, edit `.env` in another terminal:**

```bash
nano /path/to/SafetyvoiceUK/.env
```

Set at minimum:

```
API_KEY=your_gemini_api_key
DB_PASSWORD=a_strong_password
DATABASE_URL=mysql://svadmin:a_strong_password@localhost:3306/safetyvoice
ADMIN_SECRET=a_strong_random_secret_min_16_chars
DOMAIN=yourdomain.com
```

> `DB_PASSWORD` and the password inside `DATABASE_URL` must be identical.

Press **Enter** in the script terminal to continue once `.env` is saved.

### Step 4 — Verify everything is running

```bash
# Check the service is active
systemctl status safetyvoice-uk

# Watch live logs
journalctl -u safetyvoice-uk -f
```

Then open your browser:

```
http://yourdomain.com        → the website
http://yourdomain.com/#/admin  → admin panel (password = ADMIN_SECRET)
```

You should see the SafetyVoice UK homepage. If you see a blank page or error, check logs with `journalctl -u safetyvoice-uk -f`.

---

## Option B — Manual Deployment

Use this if you prefer step-by-step control.

### 1. Install git and clone

```bash
# Debian / Ubuntu
sudo apt-get update && sudo apt-get install -y git curl

# RHEL / Fedora
sudo dnf install -y git curl
```

```bash
git clone https://github.com/ZengboJamesWang/SafetyvoiceUK.git
cd SafetyvoiceUK
```

### 2. Open firewall ports

See Step 2 in Option A above.

### 3. Install Node.js 20+

```bash
# Via nvm (works on any Linux or macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
node -v   # should print v20.x.x
```

Or via package manager:

```bash
# Debian / Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# RHEL / Fedora
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

### 4. Install and start MariaDB

```bash
# Debian / Ubuntu
sudo apt-get install -y mariadb-server
sudo systemctl enable --now mariadb

# RHEL / Fedora
sudo dnf install -y mariadb-server
sudo systemctl enable --now mariadb

# macOS
brew install mariadb && brew services start mariadb
```

### 5. Create the database and user

Replace `YOUR_DB_PASSWORD` with a strong password — you will use the same value in `.env`.

```bash
sudo mysql -u root <<SQL
CREATE DATABASE IF NOT EXISTS safetyvoice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'svadmin'@'localhost' IDENTIFIED BY 'YOUR_DB_PASSWORD';
GRANT ALL PRIVILEGES ON safetyvoice.* TO 'svadmin'@'localhost';
FLUSH PRIVILEGES;
SQL

mysql -u svadmin -p'YOUR_DB_PASSWORD' safetyvoice < schema.sql
echo "Database ready"
```

### 6. Configure environment variables

```bash
cp .env.example .env
nano .env
```

See the [Environment Variables](#environment-variables) table below for all values.

### 7. Install dependencies and build

```bash
npm install
npm run build
```

### 8. Install Nginx and configure reverse proxy

```bash
# Debian / Ubuntu
sudo apt-get install -y nginx

# RHEL / Fedora
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

Copy the Nginx config (substituting your domain and port):

```bash
sudo sed "s|__DOMAIN__|yourdomain.com|g; s|__APP_PORT__|8080|g; s|__APP_DIR__|$(pwd)|g" \
  nginx.conf > /etc/nginx/sites-available/safetyvoice-uk.conf

sudo ln -sf /etc/nginx/sites-available/safetyvoice-uk.conf \
            /etc/nginx/sites-enabled/safetyvoice-uk.conf

sudo nginx -t && sudo systemctl reload nginx
```

### 9. Start the server as a systemd service

Find where `npx` lives on your system:

```bash
which npx   # e.g. /usr/bin/npx or /home/user/.nvm/versions/node/v20.x.x/bin/npx
```

Create `/etc/systemd/system/safetyvoice-uk.service` (replace paths and user):

```ini
[Unit]
Description=SafetyVoice UK
After=network.target mariadb.service

[Service]
Type=simple
User=YOUR_LINUX_USERNAME
WorkingDirectory=/home/YOUR_LINUX_USERNAME/SafetyvoiceUK
ExecStart=/full/path/to/npx tsx server/server.ts
Restart=on-failure
RestartSec=5
EnvironmentFile=/home/YOUR_LINUX_USERNAME/SafetyvoiceUK/.env

[Install]
WantedBy=multi-user.target
```

Then enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now safetyvoice-uk
systemctl status safetyvoice-uk
```

### 10. Verify

Open `http://yourdomain.com` in your browser. You should see the SafetyVoice UK homepage.

---

## Environment Variables

Copy `.env.example` to `.env` and set these values:

| Variable | Required | Description |
|----------|----------|-------------|
| `API_KEY` | Yes | Google Gemini API key |
| `DATABASE_URL` | Yes | `mysql://svadmin:YOUR_DB_PASSWORD@localhost:3306/safetyvoice` |
| `DB_PASSWORD` | Yes | Must match the password used in `DATABASE_URL` |
| `ADMIN_SECRET` | Yes | Admin panel login password — strong random string, min 16 chars |
| `PORT` | No | Server port (default: `8080`) |
| `DOMAIN` | No | Your public domain — used by `deploy.sh` for Nginx config |
| `FRONTEND_ORIGIN` | No | CORS origin — set to `https://yourdomain.com` in production |
| `NODE_ENV` | No | Set to `production` for production deployments |
| `SMTP_HOST` | No | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_SECURE` | No | `true` for port 465 TLS, `false` for STARTTLS (default) |
| `SMTP_USER` | No | SMTP login username / email address |
| `SMTP_PASS` | No | SMTP password or app-specific password |
| `NOTIFY_EMAIL` | No | Address to receive new-submission notifications |

> `DB_PASSWORD` and the password in `DATABASE_URL` must be the **same value**.
> Never commit `.env` to version control — it is in `.gitignore`.

### Email Notifications

When `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are all set, the server sends an email to `NOTIFY_EMAIL` every time a new submission is received. The subject line includes the submitter's role and region, e.g.:

```
SafetyVoice UK — New Submission [PhD Student · Scotland]
```

**Gmail example** — create an [App Password](https://myaccount.google.com/apppasswords) (requires 2FA):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.address@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
NOTIFY_EMAIL=zengbo.wang@gmail.com
```

Leave all `SMTP_*` variables empty to disable email notifications entirely — submissions are unaffected.

---

## Admin Panel

Access the admin panel at `http://yourdomain.com/#/admin`.

- **Login password** = value of `ADMIN_SECRET` in `.env`
- Once logged in, the **Security** button (top-right) lets you change the password for the current session
- To change it permanently: update `ADMIN_SECRET` in `.env` and restart the service

---

## SSL / HTTPS (Required for Production)

```bash
# Debian / Ubuntu
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# RHEL / Fedora
sudo dnf install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Certbot will automatically update your Nginx config for HTTPS and set up auto-renewal.

---

## Local Development

```bash
npm install
npm run dev                  # Vite dev server → http://localhost:3000
npx tsx server/server.ts     # API server     → http://localhost:8080
```

The app uses `localStorage` if `DATABASE_URL` is not set in `.env`.

---

## Useful Commands

| Task | Command |
|------|---------|
| Restart app | `sudo systemctl restart safetyvoice-uk` |
| View live logs | `journalctl -u safetyvoice-uk -f` |
| Stop app | `sudo systemctl stop safetyvoice-uk` |
| Rebuild after code change | `npm run build && sudo systemctl restart safetyvoice-uk` |
| MariaDB console | `mysql -u svadmin -p safetyvoice` |
| Check Nginx config | `sudo nginx -t` |
| Reload Nginx | `sudo systemctl reload nginx` |

---

## Troubleshooting

**Site not loading — getting connection refused or timeout**
Check the service is running (`systemctl status safetyvoice-uk`) and that firewall ports 80/443 are open (see Step 2). Also check your VPS provider's network firewall panel.

**Server starts but database writes fail**
Confirm `DB_PASSWORD` and the password in `DATABASE_URL` are identical. Test the connection directly: `mysql -u svadmin -p safetyvoice`.

**`ADMIN_SECRET is not configured` on admin login**
The `.env` file is missing or not in the project root. Check it exists: `ls -la .env`.

**`node: command not found` after installing via nvm**
Run `source ~/.nvm/nvm.sh && nvm use 20`. To make it permanent, add those two lines to `~/.bashrc` or `~/.zshrc`.

**Port 8080 already in use**
Find and stop the conflicting process: `lsof -i :8080`. Or change `PORT` in `.env` and update the Nginx config.

**Nginx `sites-enabled` directory not found (RHEL/Fedora)**
Use `/etc/nginx/conf.d/safetyvoice-uk.conf` instead — no symlink needed on RHEL-based systems.

---

## Security Checklist Before Going Live

- [ ] HTTPS enabled via Certbot
- [ ] `FRONTEND_ORIGIN` set to your domain (not `*`) in `.env`
- [ ] `ADMIN_SECRET` is a strong, unique password — not a dictionary word
- [ ] `.env` is not committed to git (`git status` should not show it)
- [ ] MariaDB `root` account has a password (`sudo mysql_secure_installation`)
- [ ] VPS network firewall only exposes ports 22, 80, and 443
