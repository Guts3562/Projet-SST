import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import { createTransport } from 'nodemailer';
import { rateLimit } from 'express-rate-limit';
import pool from './db.js';
import { gradeQuizAnswers, validateQuizAnswers } from './quiz.js';
import { validateAdminQuestion } from './admin.js';
import { createPasswordResetToken, hashPasswordResetToken, isValidEmail } from './passwordReset.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const PASSWORD_RESET_RESPONSE = {
  message: 'If an account exists for that email, password reset instructions will be sent.',
};
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Please try again later.' },
});

const getMailTransport = () => {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;

  if (!host || !from || !Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }
  if (Boolean(user) !== Boolean(password)) return null;

  return createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    ...(user && password ? { auth: { user, pass: password } } : {}),
  });
};

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT_SECRET and REFRESH_SECRET must be configured before starting the server.');
}
if (JWT_SECRET.length < 32 || REFRESH_SECRET.length < 32) {
  throw new Error('JWT_SECRET and REFRESH_SECRET must each contain at least 32 characters.');
}
if (JWT_SECRET === REFRESH_SECRET) {
  throw new Error('JWT_SECRET and REFRESH_SECRET must be different values.');
}

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
const signAccessToken = (userId, email, systemRole = 'client') =>
  jwt.sign({ id: userId, email, system_role: systemRole }, JWT_SECRET, { expiresIn: '15m' });

/**
 * Signs a long-lived refresh token (7 days).
 */
const signRefreshToken = (userId) =>
  jwt.sign({ id: userId, jti: randomUUID() }, REFRESH_SECRET, { expiresIn: '7d' });

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
        return res.status(401).json({ error: 'Token expired.' });
      }
      return res.status(401).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT system_role FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows[0]?.system_role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required.' });
    }
    next();
  } catch (err) {
    console.error('Failed to verify administrator access:', err);
    res.status(500).json({ error: 'Unable to verify administrator access.' });
  }
};

const recordAdminAction = (client, req, action, targetType, targetId) =>
  client.query(
    'INSERT INTO admin_audit_log (actor_user_id, action, target_type, target_id) VALUES ($1, $2, $3, $4)',
    [req.user.id, action, targetType, String(targetId)]
  );

// ── LOCAL ASSISTANT RESPONSES ──────────────────────────────────────────────────
const FALLBACK_RESPONSES = [
  { keywords: ['bonjour', 'salut', 'hello', 'bonsoir'], response: 'Bonjour. Je suis l’assistant pédagogique SST Tunisie. Je fournis des réponses prédéfinies à partir de mots-clés, sans mémoire du contexte conversationnel. Comment puis-je vous orienter ?' },
  { keywords: ['quiz', 'examen', 'test', 'évaluation', 'évaluer', 'connaissances'], response: 'Vous pouvez évaluer vos connaissances via la section « Quiz SST ». Ce quiz est pédagogique et ses réponses réglementaires doivent être vérifiées auprès des sources officielles.' },
  { keywords: ['cnss', 'assurance', 'sécurité sociale'], response: 'Pour les missions et coordonnées à jour de la CNSS, consultez son site officiel depuis la rubrique Ressources. Les détails réglementaires de cet assistant pédagogique doivent être vérifiés.' },
  { keywords: ['epi', 'protection', 'casque', 'gants', 'lunettes', 'harnais'], response: 'Le choix des équipements de protection dépend de l’évaluation des risques et des exigences applicables. Les références de normes affichées par ce projet sont en attente de vérification auprès des sources officielles.' },
  { keywords: ['loi', 'code du travail', 'législation', 'décret', 'réglementation'], response: 'Consultez le Code du Travail tunisien, ses textes modificatifs et le JORT via les portails officiels listés dans Ressources. Les numéros d’articles et décrets évoqués par ce projet ne sont pas encore vérifiés.' },
  { keywords: ['urgence', 'accident', 'secours', 'blessé', 'incendie'], response: 'En cas d’urgence, contactez les services compétents en utilisant un numéro confirmé auprès d’une source officielle tunisienne. Les numéros actuellement mentionnés dans ce projet ne sont pas encore vérifiés : ne vous y fiez pas sans confirmation.' },
  { keywords: ['isst', 'inrsst', 'institut', 'recherche'], response: 'Le site institutionnel consulté emploie le nom « Institut de santé et de sécurité au travail » (ISST). Consultez-le pour ses missions et services à jour.' },
  { keywords: ['risque', 'danger', 'prévention', 'sécurité'], response: 'La prévention des risques professionnels repose sur des principes généraux : éliminer les risques à la source, évaluer les risques, adapter le travail à l\'homme, planifier la prévention. Consultez la section « Risques » de notre plateforme.' },
  { keywords: ['merci', 'thanks', 'parfait', 'super'], response: 'Je vous en prie. La sécurité au travail est l\'affaire de tous.' },
];

const getLocalResponse = (message) => {
  const normalizedMessage = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  for (const item of FALLBACK_RESPONSES) {
    if (
      item.keywords.some((keyword) =>
        normalizedMessage.includes(
          keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
      )
    ) {
      return item.response;
    }
  }
  return 'Je n’ai pas trouvé de réponse prédéfinie correspondant aux mots-clés de votre question. Reformulez-la avec un terme comme « quiz », « EPI », « législation », « urgence », « CNSS » ou « prévention ». Consultez les portails institutionnels de la rubrique Ressources et vérifiez toute information réglementaire ou d’urgence auprès des autorités compétentes.';
};

// ── CHAT ROUTE ─────────────────────────────────────────────────────────────

app.post('/api/chat', authenticateToken, async (req, res) => {
  const { message } = req.body;
  res.json({ response: getLocalResponse(message || '') });
});

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, '../dist')));

// ── QUIZ ROUTES ───────────────────────────────────────────────────────────────

// Get all quiz questions
app.get('/api/questions', authenticateToken, async (req, res) => {
  try {
    const questions = await pool.query(
      "SELECT id, text, options, category FROM questions WHERE status = 'published' ORDER BY RANDOM()"
    );
    res.json(questions.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching questions.' });
  }
});

// ── AUTH ROUTES ───────────────────────────────────────────────────────────────

// POST /api/auth/password-reset/request
app.post('/api/auth/password-reset/request', passwordResetLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  const transporter = getMailTransport();
  if (!transporter) {
    return res.status(503).json({ error: 'Password recovery email is not configured. Contact the administrator.' });
  }

  try {
    await transporter.verify();
  } catch (err) {
    console.error('Password reset email transport verification failed:', err);
    return res.status(503).json({ error: 'Password recovery email is temporarily unavailable. Try again later.' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (userResult.rows[0]) {
      const userId = userResult.rows[0].id;
      const token = createPasswordResetToken();
      const tokenHash = hashPasswordResetToken(token);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [userId]);
        await client.query(
          'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used_at IS NULL',
          [userId]
        );
        await client.query(
          'INSERT INTO password_reset_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
          [tokenHash, userId, expiresAt]
        );
        await client.query('COMMIT');
      } catch (err) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          console.error('Failed to roll back password reset request:', rollbackError);
        }
        throw err;
      } finally {
        client.release();
      }

      const origin = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/+$/, '');
      const resetUrl = `${origin}/?resetToken=${encodeURIComponent(token)}`;
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM.trim(),
          to: email,
          subject: 'Réinitialisation de votre mot de passe SST Tunisie',
          text: `Pour choisir un nouveau mot de passe, ouvrez ce lien (valable 30 minutes) : ${resetUrl}\n\nSi vous n’avez pas demandé cette réinitialisation, ignorez ce message.`,
          html: `<p>Une demande de réinitialisation du mot de passe a été effectuée.</p><p><a href="${resetUrl}">Choisir un nouveau mot de passe</a></p><p>Ce lien est valable 30 minutes. Si vous n’êtes pas à l’origine de la demande, ignorez ce message.</p>`,
        });
      } catch (err) {
        console.error('Failed to send password reset email:', err);
        await pool.query(
          'DELETE FROM password_reset_tokens WHERE token_hash = $1',
          [tokenHash]
        );
      }
    }
    res.status(202).json(PASSWORD_RESET_RESPONSE);
  } catch (err) {
    console.error('Failed to process password reset request:', err);
    res.status(500).json({ error: 'Unable to process the password reset request.' });
  }
});

// POST /api/auth/password-reset/complete
app.post('/api/auth/password-reset/complete', passwordResetLimiter, async (req, res) => {
  const { token, password } = req.body || {};
  if (
    typeof token !== 'string' ||
    !/^[a-f0-9]{64}$/.test(token) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return res.status(400).json({ error: 'Use a valid reset link and a password between 8 and 72 bytes.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resetRecord = await client.query(
      `SELECT token_hash, user_id
       FROM password_reset_tokens
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
       FOR UPDATE`,
      [hashPasswordResetToken(token)]
    );
    if (!resetRecord.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This reset link is invalid or has expired. Request a new one.' });
    }

    const userId = resetRecord.rows[0].user_id;
    const passwordHash = await bcrypt.hash(password, 10);
    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
    await client.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = $1',
      [resetRecord.rows[0].token_hash]
    );
    await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
    await client.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL',
      [userId]
    );
    await client.query('COMMIT');
    res.json({ message: 'Password updated. You can now sign in.' });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back password reset:', rollbackError);
    }
    console.error('Failed to complete password reset:', err);
    res.status(500).json({ error: 'Unable to update the password.' });
  } finally {
    client.release();
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name, role } = req.body;
  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    typeof full_name !== 'string' ||
    !full_name.trim()
  ) {
    return res.status(400).json({ error: 'Provide a valid email, name, and password of at least 8 characters.' });
  }
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, system_role) VALUES ($1, $2, 'client') RETURNING id, email, system_role",
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
      user: { id: userId, email, full_name, role, system_role: newUser.rows[0].system_role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password, login_type: loginType } = req.body;
  if (!['client', 'admin'].includes(loginType)) {
    return res.status(400).json({ error: 'Choose a client or administrator login.' });
  }
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
    if (user.system_role !== loginType) {
      return res.status(403).json({
        error: loginType === 'admin'
          ? 'This account is not authorized for administrator access.'
          : 'Use the administrator login for this account.',
      });
    }
    const profileResult = await pool.query('SELECT * FROM profiles WHERE id = $1', [user.id]);
    const profile = profileResult.rows[0];

    const accessToken = signAccessToken(user.id, user.email, user.system_role);
    await issueRefreshToken(res, user.id);

    res.json({
      token: accessToken,
      user: { id: user.id, email: user.email, full_name: profile.full_name, role: profile.role, system_role: user.system_role }
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
    const userResult = await pool.query('SELECT email, system_role FROM users WHERE id = $1', [decoded.id]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const { email } = userResult.rows[0];
    const newAccessToken = signAccessToken(decoded.id, email, userResult.rows[0].system_role);
    await issueRefreshToken(res, decoded.id);

    res.json({ token: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Server error during token refresh.' });
  }
});

// GET /api/auth/me — restore the account and current system role from the database.
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const profileResult = await pool.query(
      'SELECT u.id, u.email, u.system_role, p.full_name, p.role, p.company, p.phone FROM users u LEFT JOIN profiles p ON p.id = u.id WHERE u.id = $1',
      [req.user.id]
    );
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }
    res.json(profileResult.rows[0]);
  } catch (err) {
    console.error('Failed to load authenticated account:', err);
    res.status(500).json({ error: 'Failed to load account.' });
  }
});

// ── PROFILE ROUTES ────────────────────────────────────────────────────────────

// GET /api/profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const profileResult = await pool.query(
      'SELECT p.*, u.system_role FROM profiles p JOIN users u ON u.id = p.id WHERE p.id = $1',
      [req.user.id]
    );
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
    await pool.query(
      'UPDATE profiles SET full_name = $1, role = $2, company = $3, phone = $4 WHERE id = $5 RETURNING *',
      [full_name, role, company, phone, req.user.id]
    );
    const result = await pool.query(
      'SELECT p.*, u.system_role FROM profiles p JOIN users u ON u.id = p.id WHERE p.id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── QUIZ RESULT ROUTES ────────────────────────────────────────────────────────

// POST /api/quiz-results
app.post('/api/quiz-results', authenticateToken, async (req, res) => {
  const answers = req.body?.answers;
  try {
    validateQuizAnswers(answers);
    const questionIds = answers.map(({ questionId }) => questionId);
    const questions = await pool.query(
      "SELECT id, options, correct FROM questions WHERE status = 'published' AND id = ANY($1::integer[])",
      [questionIds]
    );
    const grade = gradeQuizAnswers(answers, questions.rows);
    const profile = await pool.query(
      'SELECT full_name, role FROM profiles WHERE id = $1',
      [req.user.id]
    );
    const noun = profile.rows[0]?.full_name || req.user.email;
    const role = profile.rows[0]?.role || 'Utilisateur';
    const result = await pool.query(
      'INSERT INTO quiz_results (user_id, noun, role, score, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, noun, role, grade.score, grade.total]
    );
    res.status(201).json({ ...result.rows[0], ...grade });
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error grading and saving quiz result:', err);
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

// ── ADMIN API ────────────────────────────────────────────────────────────────

app.get('/api/admin/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users, questions, results, recentActivity] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query(
        "SELECT COUNT(*) FILTER (WHERE status = 'published')::int AS published, COUNT(*) FILTER (WHERE status = 'draft')::int AS drafts FROM questions"
      ),
      pool.query('SELECT COUNT(*)::int AS count FROM quiz_results'),
      pool.query(
        'SELECT a.id, a.action, a.target_type, a.target_id, a.created_at, p.full_name, u.email FROM admin_audit_log a LEFT JOIN profiles p ON p.id = a.actor_user_id LEFT JOIN users u ON u.id = a.actor_user_id ORDER BY a.created_at DESC LIMIT 10'
      ),
    ]);
    res.json({
      users: users.rows[0].count,
      quizResults: results.rows[0].count,
      questions: questions.rows[0],
      recentActivity: recentActivity.rows,
    });
  } catch (err) {
    console.error('Failed to load admin overview:', err);
    res.status(500).json({ error: 'Failed to load administrator overview.' });
  }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT u.id, u.email, u.system_role, u.created_at, p.full_name, p.role AS occupation FROM users u LEFT JOIN profiles p ON p.id = u.id ORDER BY u.created_at DESC'
    );
    res.json(users.rows);
  } catch (err) {
    console.error('Failed to list users:', err);
    res.status(500).json({ error: 'Failed to list users.' });
  }
});

app.get('/api/admin/quiz-results', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT r.id, r.user_id, r.noun, r.role, r.score, r.total, r.created_at, u.email
       FROM quiz_results r
       LEFT JOIN users u ON u.id = r.user_id
       ORDER BY r.created_at DESC, r.id DESC`
    );
    res.json(results.rows);
  } catch (err) {
    console.error('Failed to list quiz results for administrator:', err);
    res.status(500).json({ error: 'Failed to load quiz results.' });
  }
});

app.put('/api/admin/users/:userId/role', authenticateToken, requireAdmin, async (req, res) => {
  const userId = Number(req.params.userId);
  const { system_role: systemRole } = req.body || {};
  if (!Number.isInteger(userId) || userId < 1 || !['client', 'admin'].includes(systemRole)) {
    return res.status(400).json({ error: 'Provide a valid user ID and system role.' });
  }
  if (userId === req.user.id && systemRole !== 'admin') {
    return res.status(400).json({ error: 'You cannot remove your own administrator access.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE');
    const target = await client.query(
      'SELECT id, email, system_role FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );
    if (!target.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found.' });
    }
    if (target.rows[0].system_role === 'admin' && systemRole === 'client') {
      const admins = await client.query(
        "SELECT COUNT(*)::int AS count FROM users WHERE system_role = 'admin'"
      );
      if (admins.rows[0].count <= 1) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'The last administrator cannot be demoted.' });
      }
    }
    const updated = await client.query(
      'UPDATE users SET system_role = $1 WHERE id = $2 RETURNING id, email, system_role',
      [systemRole, userId]
    );
    await client.query(
      'INSERT INTO admin_audit_log (actor_user_id, action, target_type, target_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, `set_role:${systemRole}`, 'user', String(userId)]
    );
    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back user role update:', rollbackError);
    }
    console.error('Failed to update user role:', err);
    res.status(500).json({ error: 'Failed to update user role.' });
  } finally {
    client.release();
  }
});

app.get('/api/admin/questions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const questions = await pool.query(
      'SELECT id, text, options, correct, category, source_url, source_reference, verified_at, status FROM questions ORDER BY id DESC'
    );
    res.json(questions.rows);
  } catch (err) {
    console.error('Failed to list managed questions:', err);
    res.status(500).json({ error: 'Failed to list questions.' });
  }
});

app.post('/api/admin/questions', authenticateToken, requireAdmin, async (req, res) => {
  const validation = validateAdminQuestion(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });
  const question = validation.value;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const created = await client.query(
      'INSERT INTO questions (text, options, correct, category, source_url, source_reference, verified_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, text, options, correct, category, source_url, source_reference, verified_at, status',
      [question.text, question.options, question.correct, question.category, question.sourceUrl, question.sourceReference, question.verifiedAt, question.status]
    );
    await recordAdminAction(client, req, 'create', 'question', created.rows[0].id);
    await client.query('COMMIT');
    res.status(201).json(created.rows[0]);
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back question creation:', rollbackError);
    }
    console.error('Failed to create question:', err);
    res.status(500).json({ error: 'Failed to create question.' });
  } finally {
    client.release();
  }
});

app.put('/api/admin/questions/:questionId', authenticateToken, requireAdmin, async (req, res) => {
  const questionId = Number(req.params.questionId);
  if (!Number.isInteger(questionId) || questionId < 1) {
    return res.status(400).json({ error: 'Invalid question ID.' });
  }
  const validation = validateAdminQuestion(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });
  const question = validation.value;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updated = await client.query(
      'UPDATE questions SET text = $1, options = $2, correct = $3, category = $4, source_url = $5, source_reference = $6, verified_at = $7, status = $8 WHERE id = $9 RETURNING id, text, options, correct, category, source_url, source_reference, verified_at, status',
      [question.text, question.options, question.correct, question.category, question.sourceUrl, question.sourceReference, question.verifiedAt, question.status, questionId]
    );
    if (!updated.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Question not found.' });
    }
    await recordAdminAction(client, req, `update:${question.status}`, 'question', questionId);
    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back question update:', rollbackError);
    }
    console.error('Failed to update question:', err);
    res.status(500).json({ error: 'Failed to update question.' });
  } finally {
    client.release();
  }
});

app.delete('/api/admin/questions/:questionId', authenticateToken, requireAdmin, async (req, res) => {
  const questionId = Number(req.params.questionId);
  if (!Number.isInteger(questionId) || questionId < 1) {
    return res.status(400).json({ error: 'Invalid question ID.' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE questions IN SHARE ROW EXCLUSIVE MODE');
    const publishedCount = await client.query(
      "SELECT COUNT(*)::int AS count FROM questions WHERE status = 'published'"
    );
    const target = await client.query('SELECT status FROM questions WHERE id = $1 FOR UPDATE', [questionId]);
    if (!target.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Question not found.' });
    }
    if (target.rows[0].status === 'published' && publishedCount.rows[0].count <= 10) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'At least ten published questions must remain available.' });
    }
    await client.query("UPDATE questions SET status = 'archived' WHERE id = $1", [questionId]);
    await recordAdminAction(client, req, 'archive', 'question', questionId);
    await client.query('COMMIT');
    res.status(204).end();
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to roll back question archive:', rollbackError);
    }
    console.error('Failed to archive question:', err);
    res.status(500).json({ error: 'Failed to archive question.' });
  } finally {
    client.release();
  }
});

// ── CATCH-ALL ─────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ── START SERVER ──────────────────────────────────────────────────────────────
const startServer = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token_hash CHAR(64) PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(
    'CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id)'
  );
  await pool.query(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS system_role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (system_role IN ('client', 'admin'))"
  );
  await pool.query("ALTER TABLE questions ADD COLUMN IF NOT EXISTS source_url TEXT");
  await pool.query("ALTER TABLE questions ADD COLUMN IF NOT EXISTS source_reference TEXT");
  await pool.query("ALTER TABLE questions ADD COLUMN IF NOT EXISTS verified_at DATE");
  await pool.query(
    "ALTER TABLE questions ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))"
  );
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_audit_log (
      id SERIAL PRIMARY KEY,
      actor_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      target_type VARCHAR(50) NOT NULL,
      target_id VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (ADMIN_EMAIL) {
    const promoted = await pool.query(
      "UPDATE users SET system_role = 'admin' WHERE LOWER(email) = $1",
      [ADMIN_EMAIL]
    );
    if (promoted.rowCount === 0) {
      console.warn(`Configured administrator account ${ADMIN_EMAIL} does not exist yet.`);
    }
  }

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
};

startServer().catch((err) => {
  console.error('❌ Failed to initialize the server:', err);
  process.exitCode = 1;
});
