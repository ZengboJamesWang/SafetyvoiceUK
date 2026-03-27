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

## Prerequisites

Before deploying, you will need:

- A **Google Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey)
- A **domain name** pointing to your server (optional for local use, required for public deployment)
- **Root / sudo access** on Linux, or **Homebrew** on macOS

---

## Option A — Automated Deployment (Recommended)

The `deploy.sh` script detects your OS, installs all dependencies, sets up the database, builds the frontend, and registers the app as a system service.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_ORG/safetyvoice-uk.git
cd safetyvoice-uk
```

### 2. Configure environment variables

```bash
cp .env.example .env
nano .env
```

Fill in all required values — see the [Environment Variables](#environment-variables) section below.

### 3. Run the deployment script

```bash
# Linux — requires root or sudo
sudo bash deploy.sh

# macOS — no sudo needed, Homebrew must be installed
bash deploy.sh
```

The script will:
1. Detect your OS and install **Node.js 20+**, **MariaDB**, and **Nginx**
2. Create the `safetyvoice` database and `svadmin` user, import `schema.sql`
3. Run `npm ci` and `npm run build`
4. Register the app as a **systemd** service (Linux) or **launchd** agent (macOS)
5. Write an Nginx reverse-proxy config for your domain

> The script pauses before the database step so you can finish editing `.env` if needed.

### 4. Verify the service

**Linux:**
```bash
systemctl status safetyvoice-uk
journalctl -u safetyvoice-uk -f
```

**macOS:**
```bash
launchctl list | grep safetyvoice
tail -f logs/server.log
```

---

## Option B — Manual Deployment

Use this if you prefer full control or the automated script does not suit your environment.

### 1. Install Node.js 20+

**Via nvm (recommended — works on Linux and macOS):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
```

**Via package manager:**
```bash
# Debian / Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# RHEL / Fedora
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

### 2. Install and start MariaDB

```bash
# Debian / Ubuntu
sudo apt-get install -y mariadb-server
sudo systemctl enable --now mariadb

# RHEL / Fedora
sudo dnf install -y mariadb-server
sudo systemctl enable --now mariadb

# macOS
brew install mariadb
brew services start mariadb
```

### 3. Create the database and user

```bash
sudo mysql -u root <<SQL
CREATE DATABASE IF NOT EXISTS safetyvoice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'svadmin'@'localhost' IDENTIFIED BY 'YOUR_DB_PASSWORD';
GRANT ALL PRIVILEGES ON safetyvoice.* TO 'svadmin'@'localhost';
FLUSH PRIVILEGES;
SQL

mysql -u svadmin -p'YOUR_DB_PASSWORD' safetyvoice < schema.sql
```

### 4. Configure environment variables

```bash
cp .env.example .env
nano .env
```

### 5. Install dependencies and build

```bash
npm install
npm run build
```

### 6. Start the server

**Foreground (testing):**
```bash
npm start
```

**Background with nohup:**
```bash
nohup npm start > logs/server.log 2>&1 &
```

**As a systemd service (Linux — recommended for production):**

Create `/etc/systemd/system/safetyvoice-uk.service`:
```ini
[Unit]
Description=SafetyVoice UK
After=network.target mariadb.service

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/path/to/safetyvoice-uk
ExecStart=/usr/bin/npx tsx server/server.ts
Restart=on-failure
EnvironmentFile=/path/to/safetyvoice-uk/.env

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now safetyvoice-uk
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values below.

| Variable | Required | Description |
|----------|----------|-------------|
| `API_KEY` | Yes | Google Gemini API key |
| `DATABASE_URL` | Yes | `mysql://svadmin:PASSWORD@localhost:3306/safetyvoice` |
| `ADMIN_SECRET` | Yes | Password for the admin panel — use a strong random string (min 16 chars) |
| `DB_PASSWORD` | Yes | MariaDB password for the `svadmin` user |
| `PORT` | No | Server port (default: `8080`) |
| `DOMAIN` | No | Your public domain — used by `deploy.sh` when writing the Nginx config |
| `FRONTEND_ORIGIN` | No | CORS origin (default: `*`) — set to your domain in production |

> **Never commit `.env` to version control.** It is listed in `.gitignore`.

---

## Admin Panel

The admin panel is available at `http://yourdomain.com/#/admin`.

**Login password** is the value of `ADMIN_SECRET` in your `.env` file.

Once logged in, the **Security** button (top-right of the dashboard) allows you to change the password for the current server session. To make the change permanent, update `ADMIN_SECRET` in `.env` and restart the service.

---

## SSL / HTTPS (Recommended for Production)

```bash
# Debian / Ubuntu
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# RHEL / Fedora
sudo dnf install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

After Certbot runs, uncomment the HTTPS `server {}` block in your Nginx config file (path shown at the end of `deploy.sh` output or in `nginx.conf`).

---

## Local Development

```bash
npm install
npm run dev                    # Vite dev server → http://localhost:3000
npx tsx server/server.ts       # API server     → http://localhost:8080
```

The app falls back to `localStorage` if no database is configured. Set `DATABASE_URL` in `.env` to enable full persistence.

---

## Useful Commands

| Task | Command |
|------|---------|
| Restart app (Linux) | `sudo systemctl restart safetyvoice-uk` |
| View logs (Linux) | `journalctl -u safetyvoice-uk -f` |
| Restart app (macOS) | `launchctl kickstart -k gui/$(id -u)/uk.safetyvoice.server` |
| View logs (macOS) | `tail -f logs/server.log` |
| Rebuild after code change | `npm run build && sudo systemctl restart safetyvoice-uk` |
| MariaDB console | `mysql -u svadmin -p safetyvoice` |
| Run tests | `npm test` |

---

## Troubleshooting

**Server starts but database writes fail**
Check `DATABASE_URL` in `.env` — the password must match the MariaDB user password exactly. Test the connection: `mysql -u svadmin -p safetyvoice`.

**`ADMIN_SECRET is not configured` error on login**
The `.env` file is not being loaded. Make sure it exists in the project root and `ADMIN_SECRET` is set.

**Port 8080 already in use**
Change `PORT` in `.env` and update your Nginx proxy config accordingly.

**`node: command not found` after install via nvm**
Run `source ~/.nvm/nvm.sh && nvm use 20` in your current shell, or add it to your shell profile.

---

## Security

- Enable **HTTPS** before accepting real submissions — the app enforces strict security headers via `helmet`.
- Set `FRONTEND_ORIGIN` in `.env` to your domain in production — do not leave it as `*`.
- The deploy script creates a dedicated `svadmin` database user — do not use the MariaDB `root` account for the app.
- `API_KEY` and `ADMIN_SECRET` must only be set in `.env`, never hardcoded in source files.
- Submissions are archived long-term in accordance with UK GDPR and institutional data governance standards.
