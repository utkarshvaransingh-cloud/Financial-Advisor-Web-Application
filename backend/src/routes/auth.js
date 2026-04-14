const express = require('express');
const bcrypt = require('bcryptjs');

const { query } = require('../config/db');
const { getConfig } = require('../config/env');
const { requireAuth } = require('../middleware/requireAuth');
const { sanitizeUser, signAccessToken } = require('../utils/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const userResult = await query(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `,
    [name, email, passwordHash],
  );
  const user = userResult.rows[0];

  const config = getConfig();
  const token = signAccessToken({ userId: String(user.id) }, config.jwtSecret);

  return res.status(201).json({ token, user: sanitizeUser(user) });
});

router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  const result = await query(
    `
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = $1
    `,
    [email],
  );
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const config = getConfig();
  const token = signAccessToken({ userId: String(user.id) }, config.jwtSecret);
  return res.json({ token, user: sanitizeUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const result = await query(
    `
      SELECT id, name, email
      FROM users
      WHERE id = $1
    `,
    [req.userId],
  );
  const user = result.rows[0];
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: sanitizeUser(user) });
});

module.exports = router;

