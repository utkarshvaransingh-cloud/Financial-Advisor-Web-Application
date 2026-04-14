const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { getConfig } = require('../config/env');
const { requireAuth } = require('../middleware/requireAuth');
const { sanitizeUser, signAccessToken } = require('../utils/auth');

const router = express.Router();

function isDbConnected() {
  // eslint-disable-next-line global-require
  const mongoose = require('mongoose');
  return mongoose.connection?.readyState === 1;
}

router.post('/register', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const config = getConfig();
  const token = signAccessToken({ userId: String(user._id) }, config.jwtSecret);

  return res.status(201).json({ token, user: sanitizeUser(user) });
});

router.post('/login', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const config = getConfig();
  const token = signAccessToken({ userId: String(user._id) }, config.jwtSecret);
  return res.json({ token, user: sanitizeUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: sanitizeUser(user) });
});

module.exports = router;

