
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import 'dotenv/config';
import nodemailer from 'nodemailer';
import { localRedact, generateAnonymizedDraft } from './geminiService';
import pool from './db';
import { seedIfEmpty } from './seed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email transporter — only created when SMTP credentials are configured
const mailer = (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

async function sendSubmissionNotification(id: string, role?: string, region?: string) {
  if (!mailer || !process.env.NOTIFY_EMAIL) return;
  const meta = [role, region].filter(Boolean).join(' · ');
  try {
    await mailer.sendMail({
      from: `"SafetyVoice UK" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `SafetyVoice UK — New Submission${meta ? ` [${meta}]` : ''}`,
      text: [
        'A new experience report has been submitted on SafetyVoice UK.',
        '',
        `Submission ID : ${id}`,
        `Role          : ${role || 'Unspecified'}`,
        `Region        : ${region || 'Unspecified'}`,
        '',
        'Log in to the admin panel to review and moderate this submission.',
      ].join('\n'),
    });
  } catch (err) {
    console.error('[email] Failed to send notification:', err);
  }
}

// ---- SQL helpers ----

const SUBMISSION_SELECT = `
  SELECT
    id,
    created_at        AS "createdAt",
    status,
    role,
    institution_type  AS "institutionType",
    region,
    discipline,
    time_window       AS "timeWindow",
    what_happened     AS "whatHappened",
    impact,
    improvement,
    consent_publish   AS "consentPublish",
    contact_name      AS "contactName",
    contact_email     AS "contactEmail",
    publish_title     AS "publishTitle",
    publish_summary   AS "publishSummary",
    publish_story     AS "publishStory",
    anonymisation_notes AS "anonymisationNotes",
    risk_flags        AS "riskFlags",
    confidence,
    published_at      AS "publishedAt",
    admin_notes       AS "adminNotes"
  FROM submissions
`;

function mapRow(row: Record<string, unknown>) {
  return {
    ...row,
    createdAt: row.createdAt instanceof Date ? (row.createdAt as Date).toISOString() : row.createdAt,
    publishedAt: row.publishedAt instanceof Date ? (row.publishedAt as Date).toISOString() : row.publishedAt,
    anonymisationNotes: typeof row.anonymisationNotes === 'string'
      ? JSON.parse(row.anonymisationNotes || '[]')
      : (row.anonymisationNotes ?? []),
    riskFlags: typeof row.riskFlags === 'string'
      ? JSON.parse(row.riskFlags || '[]')
      : (row.riskFlags ?? []),
  };
}

// ---- App setup ----

const app = express();
const PORT = process.env.PORT || 8080;

// Admin password — defaults to 'admin123' if ADMIN_SECRET is not set
let adminPassword = process.env.ADMIN_SECRET || 'admin123';

// In-memory session tokens (cleared on restart / password change)
const validTokens = new Set<string>();

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised.' });
  }
  const token = auth.slice(7);
  if (!validTokens.has(token)) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }
  next();
}

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../dist')));

// Rate limiting for submissions
const submissionLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

const submissionSchema = z.object({
  role: z.string().optional(),
  institutionType: z.string().optional(),
  region: z.string().optional(),
  discipline: z.string().optional(),
  timeWindow: z.string().optional(),
  whatHappened: z.string().min(10),
  impact: z.string().min(5),
  improvement: z.string().min(5),
  consentPublish: z.boolean(),
  contactName: z.string().max(100).optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  hp: z.string().max(0),
});

// --- API ENDPOINTS ---

// Admin login — returns a session token
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!adminPassword) {
    return res.status(503).json({ error: 'ADMIN_SECRET is not configured on the server.' });
  }
  if (password === adminPassword) {
    const token = randomUUID();
    validTokens.add(token);
    return res.status(200).json({ ok: true, token });
  }
  return res.status(401).json({ error: 'Invalid credentials.' });
});

// Admin change password — invalidates all sessions
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { next } = req.body || {};
  if (!next || next.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }
  adminPassword = next;
  validTokens.clear(); // force re-login
  return res.status(200).json({ ok: true });
});

// Public: published stories (safe fields only)
app.get('/api/stories', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `${SUBMISSION_SELECT} WHERE status = 'published' ORDER BY published_at DESC`
    );
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: all submissions
app.get('/api/admin/submissions', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(`${SUBMISSION_SELECT} ORDER BY created_at DESC`);
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: update submission status
app.patch('/api/submissions/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const validStatuses = ['private', 'draft_generated', 'approved', 'published', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  try {
    const publishedAt = status === 'published' ? new Date() : null;
    await pool.query(
      `UPDATE submissions SET status = $1, published_at = COALESCE($2, published_at) WHERE id = $3`,
      [status, publishedAt, id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit new experience
app.post('/api/submissions', submissionLimiter, async (req, res) => {
  try {
    const data = submissionSchema.parse(req.body);
    const combinedText = `${data.whatHappened}\n\n${data.impact}\n\n${data.improvement}`;
    const sanitisedText = localRedact(combinedText);

    const draft = await generateAnonymizedDraft(data, sanitisedText);

    const submissionId = `prod-${Date.now()}`;

    await pool.query(
      `INSERT INTO submissions (
        id, status, role, institution_type, region, discipline, time_window,
        what_happened, impact, improvement, consent_publish,
        contact_name, contact_email,
        publish_title, publish_summary, publish_story,
        anonymisation_notes, risk_flags, confidence
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [
        submissionId,
        'draft_generated',
        data.role ?? null,
        data.institutionType ?? null,
        data.region ?? null,
        data.discipline ?? null,
        data.timeWindow ?? null,
        data.whatHappened,
        data.impact,
        data.improvement,
        data.consentPublish,
        data.contactName ?? null,
        data.contactEmail ?? null,
        draft.publishTitle,
        draft.publishSummary,
        draft.publishStory,
        JSON.stringify(draft.anonymisationNotes),
        JSON.stringify(draft.riskFlags || []),
        draft.confidence,
      ]
    );

    sendSubmissionNotification(submissionId, data.role, data.region);

    res.status(201).json({
      success: true,
      id: submissionId,
      draft,
      message: 'Submission received and securely archived for 10 years.',
    });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback to React app for non-API routes
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server — seed DB on first run
app.listen(PORT, async () => {
  console.log(`SafetyVoice UK Backend running on port ${PORT}`);
  try {
    await seedIfEmpty(pool);
  } catch (err) {
    console.error('[seed] Failed:', err);
  }
});
