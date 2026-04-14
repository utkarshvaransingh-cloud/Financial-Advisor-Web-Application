const express = require('express');

const { query } = require('../config/db');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

function parsePositiveAmount(value) {
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function parseEntryDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function normalizeExpense(row) {
  return {
    id: row.id,
    amount: Number(row.amount),
    category: row.category,
    note: row.note || '',
    date: row.entry_date,
  };
}

function normalizeIncome(row) {
  return {
    id: row.id,
    amount: Number(row.amount),
    source: row.source,
    date: row.entry_date,
  };
}

function normalizeBudget(row) {
  return {
    id: row.id,
    category: row.category,
    limit: Number(row.monthly_limit),
  };
}

router.get('/bootstrap', async (req, res) => {
  const userId = req.userId;

  const [expensesResult, incomesResult, budgetsResult] = await Promise.all([
    query(
      `
        SELECT id, amount, category, note, entry_date
        FROM expenses
        WHERE user_id = $1
        ORDER BY entry_date DESC, created_at DESC
      `,
      [userId],
    ),
    query(
      `
        SELECT id, amount, source, entry_date
        FROM incomes
        WHERE user_id = $1
        ORDER BY entry_date DESC, created_at DESC
      `,
      [userId],
    ),
    query(
      `
        SELECT id, category, monthly_limit
        FROM budgets
        WHERE user_id = $1
        ORDER BY category ASC
      `,
      [userId],
    ),
  ]);

  return res.json({
    expenses: expensesResult.rows.map(normalizeExpense),
    incomes: incomesResult.rows.map(normalizeIncome),
    budgets: budgetsResult.rows.map(normalizeBudget),
  });
});

router.post('/expenses', async (req, res) => {
  const amount = parsePositiveAmount(req.body?.amount);
  const category = String(req.body?.category || '').trim();
  const note = String(req.body?.note || '').trim();
  const entryDate = parseEntryDate(req.body?.date);

  if (!amount) return res.status(400).json({ error: 'Amount must be greater than 0' });
  if (!category) return res.status(400).json({ error: 'Category is required' });
  if (!entryDate) return res.status(400).json({ error: 'Valid date is required' });

  const result = await query(
    `
      INSERT INTO expenses (user_id, amount, category, note, entry_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, amount, category, note, entry_date
    `,
    [req.userId, amount, category, note, entryDate],
  );

  return res.status(201).json({ expense: normalizeExpense(result.rows[0]) });
});

router.post('/incomes', async (req, res) => {
  const amount = parsePositiveAmount(req.body?.amount);
  const source = String(req.body?.source || '').trim();
  const entryDate = parseEntryDate(req.body?.date);

  if (!amount) return res.status(400).json({ error: 'Amount must be greater than 0' });
  if (!source) return res.status(400).json({ error: 'Source is required' });
  if (!entryDate) return res.status(400).json({ error: 'Valid date is required' });

  const result = await query(
    `
      INSERT INTO incomes (user_id, amount, source, entry_date)
      VALUES ($1, $2, $3, $4)
      RETURNING id, amount, source, entry_date
    `,
    [req.userId, amount, source, entryDate],
  );

  return res.status(201).json({ income: normalizeIncome(result.rows[0]) });
});

router.put('/budgets/:category', async (req, res) => {
  const paramsCategory = String(req.params.category || '').trim();
  const bodyCategory = String(req.body?.category || '').trim();
  const category = bodyCategory || paramsCategory;
  const limit = parsePositiveAmount(req.body?.limit);

  if (!category) return res.status(400).json({ error: 'Category is required' });
  if (!limit) return res.status(400).json({ error: 'Limit must be greater than 0' });

  const result = await query(
    `
      INSERT INTO budgets (user_id, category, monthly_limit)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, category)
      DO UPDATE SET
        monthly_limit = EXCLUDED.monthly_limit,
        updated_at = NOW()
      RETURNING id, category, monthly_limit
    `,
    [req.userId, category, limit],
  );

  return res.json({ budget: normalizeBudget(result.rows[0]) });
});

module.exports = router;
