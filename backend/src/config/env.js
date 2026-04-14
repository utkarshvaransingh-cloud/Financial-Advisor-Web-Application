function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getConfig() {
  return {
    port: Number(process.env.PORT || 5000),
    mongoUri: requireEnv('MONGODB_URI'),
    jwtSecret: requireEnv('JWT_SECRET'),
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

module.exports = { getConfig };

