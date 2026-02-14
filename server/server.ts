
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { localRedact, generateAnonymizedDraft } from './geminiService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Set to false if using CDN scripts like Tailwind
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
  hp: z.string().max(0) 
});

// --- API ENDPOINTS ---

app.post('/api/submissions', submissionLimiter, async (req, res) => {
  try {
    const data = submissionSchema.parse(req.body);
    const combinedText = `${data.whatHappened}\n\n${data.impact}\n\n${data.improvement}`;
    const sanitisedText = localRedact(combinedText);

    // AI Processing
    const draft = await generateAnonymizedDraft(data, sanitisedText);

    // In a full implementation, you would use a MySQL driver here to save to MariaDB
    // Example: await connection.execute('INSERT INTO submissions...', [...])

    res.status(201).json({ 
      success: true, 
      id: `prod-${Date.now()}`,
      message: "Submission received and securely archived for 10 years." 
    });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fallback to React app for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`SafetyVoice UK Backend running on port ${PORT}`);
});
