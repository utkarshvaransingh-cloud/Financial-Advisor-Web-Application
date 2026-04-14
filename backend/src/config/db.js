const { Pool } = require('pg');

let pool;

function shouldUseSsl(connectionString) {
  return !/localhost|127\.0\.0\.1/i.test(connectionString);
}

function getPool(databaseUrl) {
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
}

async function query(text, params = []) {
  if (!pool) {
    throw new Error('Database pool has not been initialized');
  }

  return pool.query(text, params);
}

async function connectToDatabase(databaseUrl) {
  const nextPool = getPool(databaseUrl);
  await nextPool.query('SELECT 1');
  return nextPool;
}

async function initSchema() {
  await query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(80) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS incomes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
      source VARCHAR(120) NOT NULL,
      entry_date TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
      category VARCHAR(80) NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      entry_date TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS budgets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category VARCHAR(80) NOT NULL,
      monthly_limit NUMERIC(12, 2) NOT NULL CHECK (monthly_limit > 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT budgets_user_category_key UNIQUE (user_id, category)
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS expenses_user_date_idx
    ON expenses (user_id, entry_date DESC)
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS incomes_user_date_idx
    ON incomes (user_id, entry_date DESC)
  `);
}

module.exports = { connectToDatabase, getPool, initSchema, query };

