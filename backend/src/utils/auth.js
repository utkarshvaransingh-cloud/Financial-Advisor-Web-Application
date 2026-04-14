const jwt = require('jsonwebtoken');

function signAccessToken({ userId }, jwtSecret) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
}

function verifyAccessToken(token, jwtSecret) {
  return jwt.verify(token, jwtSecret);
}

function sanitizeUser(userDoc) {
  return {
    id: String(userDoc._id),
    name: userDoc.name,
    email: userDoc.email,
  };
}

module.exports = { signAccessToken, verifyAccessToken, sanitizeUser };

