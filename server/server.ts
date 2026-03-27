
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import 'dotenv/config';
import { localRedact, generateAnonymizedDraft } from './geminiService';
import pool from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Admin password — seeded from ADMIN_SECRET env var, changeable at runtime
let adminPassword = process.env.ADMIN_SECRET || '';

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../dist')));

// Rate limiting for submissions
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10
});

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
  // Optional contact details — stored only, never passed to AI or published
  contactName: z.string().max(100).optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  hp: z.string().max(0)
});

// --- API ENDPOINTS ---

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!adminPassword) {
    return res.status(503).json({ error: 'ADMIN_SECRET is not configured on the server.' });
  }
  if (password === adminPassword) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ error: 'Invalid credentials.' });
});

app.post('/api/admin/change-password', (req, res) => {
  const { current, next } = req.body || {};
  if (current !== adminPassword) {
    return res.status(401).json({ error: 'Current password incorrect.' });
  }
  if (!next || next.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }
  adminPassword = next;
  return res.status(200).json({ ok: true });
});

app.post('/api/submissions', submissionLimiter, async (req, res) => {
  try {
    const data = submissionSchema.parse(req.body);
    const combinedText = `${data.whatHappened}\n\n${data.impact}\n\n${data.improvement}`;
    const sanitisedText = localRedact(combinedText);

    // AI Processing
    const draft = await generateAnonymizedDraft(data, sanitisedText);

    const submissionId = `prod-${Date.now()}`;

    if (process.env.DATABASE_URL) {
      await pool.execute(
        `INSERT INTO submissions (
          id, status, role, institutionType, region, discipline, timeWindow,
          whatHappened, impact, improvement, consentPublish,
          contactName, contactEmail,
          publishTitle, publishSummary, publishStory, anonymisationNotes, riskFlags, confidence
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          submissionId,
          'draft_generated',
          data.role,
          data.institutionType,
          data.region,
          data.discipline,
          data.timeWindow,
          data.whatHappened,
          data.impact,
          data.improvement,
          data.consentPublish,
          data.contactName || null,
          data.contactEmail || null,
          draft.publishTitle,
          draft.publishSummary,
          draft.publishStory,
          JSON.stringify(draft.anonymisationNotes),
          JSON.stringify(draft.riskFlags || []),
          draft.confidence
        ]
      );
    }

    res.status(201).json({ 
      success: true, 
      id: submissionId,
      draft,
      message: "Submission received and securely archived for 10 years." 
    });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fallback to React app for non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`SafetyVoice UK Backend running on port ${PORT}`);
});
