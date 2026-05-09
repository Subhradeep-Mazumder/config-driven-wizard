import express, { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 4300);
const SECRET = process.env.AUTH_SECRET ?? 'dev-secret-not-for-prod';

interface UserRecord {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

const users: UserRecord[] = [
  { id: 'u-1', username: 'admin', password: 'admin', role: 'admin' },
  { id: 'u-2', username: 'user', password: 'user', role: 'user' },
];

const takenEmails = new Set(['taken@example.com', 'existing@example.com']);

function issueToken(userId: string): string {
  const payload = `${userId}.${Date.now()}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex').slice(0, 24);
  return Buffer.from(`${payload}.${sig}`).toString('base64url');
}

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};
  const record = users.find((u) => u.username === username && u.password === password);
  if (!record) return res.status(401).json({ error: 'Invalid credentials' });
  const token = issueToken(record.id);
  const expiresAt = Date.now() + 60 * 60 * 1000;
  res.json({
    token,
    expiresAt,
    user: { id: record.id, username: record.username, role: record.role },
  });
});

app.get('/api/wizard/check-email', (req, res) => {
  const email = String(req.query.email ?? '').toLowerCase();
  res.json({ unique: !takenEmails.has(email) });
});

app.post('/api/wizard/submit', (_req, res) => {
  res.json({ jobId: `job-${Date.now()}` });
});

app.get('/events', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const script = [
    { status: 'pending', message: 'Queued for verification', delay: 1000 },
    { status: 'verifying', message: 'Reviewing documents', delay: 4000 },
    { status: 'verifying', message: 'Running compliance checks', delay: 7000 },
    { status: 'approved', message: 'Verification passed', delay: 10000 },
  ];

  const timers: NodeJS.Timeout[] = [];
  script.forEach((step) => {
    timers.push(
      setTimeout(() => {
        res.write(
          `data: ${JSON.stringify({ ...step, timestamp: Date.now() })}\n\n`,
        );
      }, step.delay),
    );
  });

  const heartbeat = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 15000);

  _req.on('close', () => {
    timers.forEach(clearTimeout);
    clearInterval(heartbeat);
    res.end();
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});
