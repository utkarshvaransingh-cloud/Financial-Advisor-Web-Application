require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { getConfig } = require('./config/env');
const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const config = getConfig();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'financial-advisor-api',
    env: config.nodeEnv,
    db: {
      connected: mongoose.connection?.readyState === 1,
      readyState: mongoose.connection?.readyState ?? 0,
    },
  });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function start() {
  try {
    await connectToDatabase(config.mongoUri);
  } catch (err) {
    console.error('MongoDB connection failed. Starting API without DB.', err);
  }

  app.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
