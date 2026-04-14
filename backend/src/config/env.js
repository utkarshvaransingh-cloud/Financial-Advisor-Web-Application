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
    databaseUrl: requireEnv('DATABASE_URL'),
    jwtSecret: requireEnv('JWT_SECRET'),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

module.exports = { getConfig };

