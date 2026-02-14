
# SafetyVoice UK - Deployment Guide (Hostinger)

This repository is configured for a professional deployment on **Hostinger** using their **GitHub Integration**. This setup ensures that every time you push to your `main` branch, the site updates automatically.

## 🚀 Project Overview
- **Project Phase:** 01/02/2026 — 31/01/2029
- **Governance:** UKRI-aligned 10-year data preservation (until 2039)
- **Stack:** React, Node.js (Express), MariaDB, Google Gemini AI

---

## 🛠 Step 1: MariaDB Database Setup (Hostinger hPanel)

Hostinger does not automatically create databases from code. You must perform this manual step:

1. Log in to your **Hostinger hPanel**.
2. Go to **Databases** > **MySQL Databases**.
3. Create a new database:
   - **Database Name:** e.g., `u123456789_safety`
   - **MySQL User:** e.g., `u123456789_admin`
   - **Password:** *[Create a strong password]*
4. Once created, click **Enter phpMyAdmin**.
5. Select your database on the left, click the **SQL** tab at the top.
6. Open the `schema.sql` file from this project, copy the content, paste it into the SQL box, and click **Go**.

---

## 🔗 Step 2: GitHub Integration & Deployment

1. Go to **Hostinger hPanel** > **Advanced** > **GIT**.
2. Under **Repository URL**, paste your GitHub repo link (e.g., `https://github.com/youruser/safetyvoice-uk`).
3. Set **Branch** to `main`.
4. Set **Install Path** to `/public_html`.
5. Click **Create**.
6. **Important:** Enable **Auto Deployment** so Hostinger pulls new code automatically when you push to GitHub.

---

## ⚙️ Step 3: Node.js Configuration

SafetyVoice UK requires a Node.js environment to handle AI processing and Database communication.

1. In hPanel, go to **Advanced** > **Node.js**.
2. Select **Node.js Version** (v20 or higher recommended).
3. Set the **Application Root** to `/public_html`.
4. Set the **Application URL** (your domain).
5. Set the **Entry Point** to `server/server.ts` (or the compiled version if you build locally).
6. Click **Edit Environment Variables** and add the following:
   - `API_KEY`: *[Your Google Gemini API Key]*
   - `DATABASE_URL`: `mysql://USER:PASS@localhost:3306/DB_NAME` (Replace with your Step 1 credentials)
   - `NODE_ENV`: `production`
7. Click **Run NPM Install** and then **Restart**.

---

## 🔒 Security & Compliance

- **SSL:** Ensure Hostinger's "Free SSL" is active. The application requires HTTPS for secure data submission.
- **UK GDPR:** The platform is configured to archive raw submissions for 10 years. Do not delete the database even after the active research phase ends in 2029.
- **API Security:** Never hardcode your `API_KEY` in `server.ts`. Always use the Hostinger Environment Variables.

---

## 🧪 Local Testing before Pushing

To test locally before your final push to GitHub:
```bash
npm install
npm run dev
```
The app will use `localStorage` for development. When deployed on Hostinger, it will automatically attempt to sync with your MariaDB backend.
