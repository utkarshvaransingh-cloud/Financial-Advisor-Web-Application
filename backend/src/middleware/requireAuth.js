const { getConfig } = require('../config/env');
const { verifyAccessToken } = require('../utils/auth');

function parseBearerToken(req) {
  const header = req.header('authorization') || req.header('Authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

function requireAuth(req, res, next) {
  const token = parseBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  try {
    const config = getConfig();
    const decoded = verifyAccessToken(token, config.jwtSecret);
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };

