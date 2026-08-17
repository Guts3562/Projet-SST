import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback_refresh_secret';

// ── CORS: allow credentials (needed for httpOnly cookie) ──────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from Vite dev server (localhost or local network IPs) or when origin is absent
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else if (process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── TOKEN HELPERS ─────────────────────────────────────────────────────────────

/**
 * Signs a short-lived access token (15 minutes).
 */
const signAccessToken = (userId, email) =>
  jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '15m' });

/**
 * Signs a long-lived refresh token (7 days).
 */
const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });

/**
 * Stores a refresh token in the DB and sets it as an httpOnly cookie.
 */
const issueRefreshToken = async (res, userId) => {
  const refreshToken = signRefreshToken(userId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Persist in DB (one active refresh token per session)
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, refreshToken, expiresAt]
  );

  // Deliver as httpOnly cookie — JS cannot read this token
  res.cookie('sst_refresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/api/auth',                // Scoped: only sent to auth endpoints
  });

  return refreshToken;
};

/**
 * Middleware to authenticate the short-lived access token (Bearer header).
 * Distinguishes expired tokens (403 + 'Token expired.') from invalid ones,
 * allowing the client to silently attempt a refresh before forcing logout.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token expired.' });
      }
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// ── LOCAL ASSISTANT RESPONSES ──────────────────────────────────────────────────
const FALLBACK_RESPONSES = [
  { keywords: ['bonjour', 'salut', 'hello', 'bonsoir'], response: 'Bonjour. Je suis l\'assistant SST Tunisie. Comment puis-je vous assister ?' },
  { keywords: ['quiz', 'examen', 'test', 'évaluation'], response: 'Vous pouvez évaluer vos connaissances via la section « Quiz SST ». Cette évaluation couvre la législation, les urgences, les EPI et les bonnes pratiques tunisiennes.' },
  { keywords: ['cnss', 'assurance', 'sécurité sociale'], response: 'La CNSS — Caisse Nationale de Sécurité Sociale — assure la gestion des risques professionnels, des accidents du travail et des maladies professionnelles. Ligne verte : 55 590 228.' },
  { keywords: ['epi', 'protection', 'casque', 'gants', 'lunettes', 'harnais'], response: 'Les EPI (Équipements de Protection Individuelle) sont réglementés selon la nature du risque :\n• Casque (NT 09.02) — BTP, mines\n• Chaussures (NT 09.01) — BTP, industrie\n• Harnais (NT 09.12) — travaux en hauteur >2m\n• Masques FFP2/3 (NT 09.08) — chimie, mines' },
  { keywords: ['loi', 'code du travail', 'législation', 'décret', 'réglementation'], response: 'Le Code du Travail tunisien, fondé sur la Loi n°66-27 du 30 avril 1966, définit les obligations de l\'employeur en matière d\'hygiène et de sécurité. Le décret n°2000-389 complète ces dispositions.' },
  { keywords: ['urgence', 'accident', 'secours', 'blessé', 'incendie'], response: 'Numéros d\'urgence en Tunisie :\n• 198 — Protection Civile\n• 190 — SAMU\n• 71 335 500 — Centre Anti-Poison' },
  { keywords: ['inrsst', 'institut', 'recherche'], response: 'L\'INRSST (Institut National de Recherche et de Sécurité en Santé au Travail) est l\'organisme de référence tunisien pour la recherche, la formation et l\'expertise technique en SST.' },
  { keywords: ['risque', 'danger', 'prévention', 'sécurité'], response: 'La prévention des risques professionnels repose sur des principes généraux : éliminer les risques à la source, évaluer les risques, adapter le travail à l\'homme, planifier la prévention. Consultez la section « Risques » de notre plateforme.' },
  { keywords: ['merci', 'thanks', 'parfait', 'super'], response: 'Je vous en prie. La sécurité au travail est l\'affaire de tous.' },
];

const getLocalResponse = (message) => {
  const lower = message.toLowerCase();
  for (const item of FALLBACK_RESPONSES) {
    if (item.keywords.some(kw => lower.includes(kw))) return item.response;
  }
  return 'Je n\'ai pas identifié de réponse précise à votre demande. Je peux vous renseigner sur la CNSS, les EPI, le Code du Travail tunisien ou les numéros d\'urgence. Veuillez reformuler votre question avec des termes spécifiques.';
};

// ── CHAT ROUTE ─────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  res.json({ response: getLocalResponse(message || '') });
});

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, '../dist')));

// ── QUIZ ROUTES ───────────────────────────────────────────────────────────────

// Get all quiz questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await pool.query('SELECT * FROM questions ORDER BY RANDOM()');
    res.json(questions.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching questions.' });
  }
});

// ── AUTH ROUTES ───────────────────────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name, role } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );
    const userId = newUser.rows[0].id;
    await pool.query(
      'INSERT INTO profiles (id, email, full_name, role) VALUES ($1, $2, $3, $4)',
      [userId, email, full_name, role]
    );

    const accessToken = signAccessToken(userId, email);
    await issueRefreshToken(res, userId);

    res.status(201).json({
      token: accessToken,
      user: { id: userId, email, full_name, role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    const profileResult = await pool.query('SELECT * FROM profiles WHERE id = $1', [user.id]);
    const profile = profileResult.rows[0];

    const accessToken = signAccessToken(user.id, user.email);
    await issueRefreshToken(res, user.id);

    res.json({
      token: accessToken,
      user: { id: user.id, email: user.email, full_name: profile.full_name, role: profile.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// POST /api/auth/logout — revoke the refresh token from DB and clear the cookie
app.post('/api/auth/logout', async (req, res) => {
  const refreshToken = req.cookies?.sst_refresh;
  if (refreshToken) {
    try {
      await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    } catch (err) {
      console.error('Error revoking refresh token:', err);
    }
  }
  res.clearCookie('sst_refresh', { path: '/api/auth' });
  res.json({ message: 'Logged out successfully.' });
});

// POST /api/auth/refresh — silent token rotation
// Reads the httpOnly refresh cookie, validates it against the DB,
// deletes the old refresh token (rotation), issues a new pair.
app.post('/api/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies?.sst_refresh;
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token.' });
  }

  // Verify the refresh token signature and expiry
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch {
    res.clearCookie('sst_refresh', { path: '/api/auth' });
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }

  try {
    // Check DB: token must exist and not be expired
    const result = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
      [refreshToken, decoded.id]
    );
    if (result.rows.length === 0) {
      res.clearCookie('sst_refresh', { path: '/api/auth' });
      return res.status(401).json({ error: 'Refresh token revoked or expired.' });
    }

    // Rotate: delete old token, issue new pair
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);

    // Fetch the user's email for the new access token
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [decoded.id]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const { email } = userResult.rows[0];
    const newAccessToken = signAccessToken(decoded.id, email);
    await issueRefreshToken(res, decoded.id);

    res.json({ token: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Server error during token refresh.' });
  }
});

// GET /api/auth/me — fast session restore from access token (no DB query)
// Returns decoded JWT payload + user email so the client can re-hydrate auth state.
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const profileResult = await pool.query(
      'SELECT id, email, full_name, role, company, phone FROM profiles WHERE id = $1',
      [req.user.id]
    );
    if (profileResult.rows.length === 0) {
      return res.json({ id: req.user.id, email: req.user.email });
    }
    res.json(profileResult.rows[0]);
  } catch {
    // Fall back to JWT payload if DB fails
    res.json({ id: req.user.id, email: req.user.email });
  }
});

// ── PROFILE ROUTES ────────────────────────────────────────────────────────────

// GET /api/profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const profileResult = await pool.query('SELECT * FROM profiles WHERE id = $1', [req.user.id]);
    if (profileResult.rows.length === 0) return res.status(404).json({ error: 'Not found.' });
    res.json(profileResult.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { full_name, role, company, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE profiles SET full_name = $1, role = $2, company = $3, phone = $4 WHERE id = $5 RETURNING *',
      [full_name, role, company, phone, req.user.id]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── QUIZ RESULT ROUTES ────────────────────────────────────────────────────────

// POST /api/quiz-results
app.post('/api/quiz-results', authenticateToken, async (req, res) => {
  const { noun, role, score, total } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO quiz_results (user_id, noun, role, score, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, noun, role, score, total]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/quiz-results
app.get('/api/quiz-results', authenticateToken, async (req, res) => {
  try {
    const results = await pool.query(
      'SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(results.rows);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── CATCH-ALL ─────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ── START SERVER ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`Please close the other process running on this port or change the PORT in server/.env`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});
