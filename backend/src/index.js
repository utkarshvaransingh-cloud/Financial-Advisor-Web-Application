require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');

const { getConfig } = require('./config/env');
const { connectToDatabase, initSchema } = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const financeRoutes = require('./routes/finance');

const app = express();
const config = getConfig();

app.use(
  cors({
    origin: config.corsOrigin.split(',').map((origin) => origin.trim()),
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'financial-advisor-api',
    env: config.nodeEnv,
    db: { connected: true, provider: 'neon-postgres' },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/finance', financeRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  return res.status(500).json({ error: err.message || 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function start() {
  try {
    await connectToDatabase(config.databaseUrl);
    await initSchema();
    console.log('Connected to Neon/Postgres and ensured schema is ready.');
  } catch (err) {
    console.error('Database connection failed. API cannot start.', err);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
