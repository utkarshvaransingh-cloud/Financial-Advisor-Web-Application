const express = require('express');

const { query } = require('../config/db');
const { getConfig } = require('../config/env');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => item && (item.role === 'user' || item.role === 'bot'))
    .map((item) => ({
      role: item.role,
      text: String(item.text || '').trim(),
    }))
    .filter((item) => item.text)
    .slice(-8);
}

async function getUserFinanceSnapshot(userId) {
  const [
    userResult,
    incomeResult,
    expenseResult,
    budgetResult,
    recentIncomeResult,
    recentExpenseResult,
    monthlyCategorySpendResult,
  ] = await Promise.all([
    query(
      `
        SELECT id, name, email
        FROM users
        WHERE id = $1
      `,
      [userId],
    ),
    query(
      `
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM incomes
        WHERE user_id = $1
          AND DATE_TRUNC('month', entry_date) = DATE_TRUNC('month', NOW())
      `,
      [userId],
    ),
    query(
      `
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE user_id = $1
          AND DATE_TRUNC('month', entry_date) = DATE_TRUNC('month', NOW())
      `,
      [userId],
    ),
    query(
      `
        SELECT category, monthly_limit
        FROM budgets
        WHERE user_id = $1
        ORDER BY monthly_limit DESC, category ASC
        LIMIT 5
      `,
      [userId],
    ),
    query(
      `
        SELECT source, amount, entry_date
        FROM incomes
        WHERE user_id = $1
        ORDER BY entry_date DESC, created_at DESC
        LIMIT 5
      `,
      [userId],
    ),
    query(
      `
        SELECT category, amount, note, entry_date
        FROM expenses
        WHERE user_id = $1
        ORDER BY entry_date DESC, created_at DESC
        LIMIT 8
      `,
      [userId],
    ),
    query(
      `
        SELECT category, COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE user_id = $1
          AND DATE_TRUNC('month', entry_date) = DATE_TRUNC('month', NOW())
        GROUP BY category
        ORDER BY total DESC, category ASC
        LIMIT 5
      `,
      [userId],
    ),
  ]);

  const monthlyIncome = Number(incomeResult.rows[0]?.total || 0);
  const monthlyExpense = Number(expenseResult.rows[0]?.total || 0);
  const monthlySavings = monthlyIncome - monthlyExpense;
  const topBudgets = budgetResult.rows.map((row) => ({
    category: row.category,
    limit: Number(row.monthly_limit),
  }));
  const topExpenseCategories = monthlyCategorySpendResult.rows.map((row) => ({
    category: row.category,
    total: Number(row.total),
  }));

  return {
    user: userResult.rows[0] || null,
    monthlyIncome,
    monthlyExpense,
    monthlySavings,
    topBudgets,
    topExpenseCategories,
    recentIncomes: recentIncomeResult.rows.map((row) => ({
      source: row.source,
      amount: Number(row.amount),
      date: row.entry_date,
    })),
    recentExpenses: recentExpenseResult.rows.map((row) => ({
      category: row.category,
      amount: Number(row.amount),
      note: row.note || '',
      date: row.entry_date,
    })),
  };
}

function buildFinanceContext(snapshot) {
  const budgetText = snapshot.topBudgets.length
    ? snapshot.topBudgets
        .map((budget) => `${budget.category}: ${formatCurrency(budget.limit)}`)
        .join(', ')
    : 'No budgets have been set yet.';

  const topExpenseText = snapshot.topExpenseCategories.length
    ? snapshot.topExpenseCategories
        .map((item) => `${item.category}: ${formatCurrency(item.total)}`)
        .join(', ')
    : 'No expense categories recorded this month yet.';

  const recentIncomeText = snapshot.recentIncomes.length
    ? snapshot.recentIncomes
        .map((income) => `${income.source} ${formatCurrency(income.amount)} on ${formatDate(income.date)}`)
        .join('; ')
    : 'No recent income entries.';

  const recentExpenseText = snapshot.recentExpenses.length
    ? snapshot.recentExpenses
        .map(
          (expense) =>
            `${expense.category} ${formatCurrency(expense.amount)} on ${formatDate(expense.date)}${expense.note ? ` (${expense.note})` : ''}`,
        )
        .join('; ')
    : 'No recent expense entries.';

  return [
    `User: ${snapshot.user?.name || 'Unknown user'} (${snapshot.user?.email || 'no email'})`,
    `Monthly income: ${formatCurrency(snapshot.monthlyIncome)}`,
    `Monthly expense: ${formatCurrency(snapshot.monthlyExpense)}`,
    `Monthly savings: ${formatCurrency(snapshot.monthlySavings)}`,
    `Budget snapshot: ${budgetText}`,
    `Top expense categories this month: ${topExpenseText}`,
    `Recent incomes: ${recentIncomeText}`,
    `Recent expenses: ${recentExpenseText}`,
  ].join('\n');
}

function buildMockReply(message, snapshot, history = []) {
  const normalized = message.toLowerCase();
  const savings = snapshot.monthlySavings;
  const userName = snapshot.user?.name || 'there';
  const leadingCategory = snapshot.topExpenseCategories[0];
  const topBudget = snapshot.topBudgets[0];
  const latestExpense = snapshot.recentExpenses[0];
  const historyHint = history.length > 0 ? ` You also asked about "${history[history.length - 1].text.slice(0, 60)}".` : '';

  if (normalized.includes('budget')) {
    if (snapshot.topBudgets.length === 0) {
      return `${userName}, you have not set any budgets yet. Start with Food, Transport, and Utilities first so I can compare your real spending against clear monthly limits.${historyHint}`;
    }

    const strongestBudget = snapshot.topBudgets[0];
    const relatedSpend = snapshot.topExpenseCategories.find(
      (item) => item.category === strongestBudget.category,
    );

    return `${userName}, your biggest tracked budget is ${strongestBudget.category} at ${formatCurrency(strongestBudget.limit)}. You have spent ${formatCurrency(relatedSpend?.total || 0)} there this month, so ${relatedSpend && relatedSpend.total > strongestBudget.limit ? 'that category needs attention soon' : 'you still have room left'}.`;
  }

  if (normalized.includes('save') || normalized.includes('savings')) {
    if (savings >= 0) {
      return `${userName}, you are currently saving ${formatCurrency(savings)} this month. ${leadingCategory ? `Your biggest spending pressure is ${leadingCategory.category} at ${formatCurrency(leadingCategory.total)}, so tightening that category first would be the fastest win.` : 'Keep logging expenses so I can point out the biggest saving opportunities.'}`;
    }
    return `${userName}, you are overspending by ${formatCurrency(Math.abs(savings))} this month. ${leadingCategory ? `The largest category right now is ${leadingCategory.category} at ${formatCurrency(leadingCategory.total)}, which is the first place I would review.` : 'Start by reviewing the last few expenses and cutting non-essential items.'}`;
  }

  if (normalized.includes('tax') || normalized.includes('itr')) {
    return `${userName}, for ITR planning keep Form 16, TDS details, bank interest, and deduction proofs handy. ${snapshot.recentIncomes.length > 1 ? 'I can see multiple income entries in your account, so it may be worth double-checking whether you have more than one income source to report.' : 'If your profile is salary-only, the filing path is usually simpler.'}`;
  }

  if (snapshot.monthlyIncome === 0 && snapshot.monthlyExpense === 0) {
    return `${userName}, I can absolutely help with budgeting, savings, and ITR basics, but I need a little more of your real data. Add at least one income and one expense entry and my suggestions will become much more personal.`;
  }

  return `${userName}, based on your profile this month you have income of ${formatCurrency(snapshot.monthlyIncome)}, expenses of ${formatCurrency(snapshot.monthlyExpense)}, and savings of ${formatCurrency(savings)}. ${leadingCategory ? `Your heaviest spending is in ${leadingCategory.category}. ` : ''}${latestExpense ? `Your latest expense was ${formatCurrency(latestExpense.amount)} for ${latestExpense.category}. ` : ''}${topBudget ? `Your top budget is ${topBudget.category} at ${formatCurrency(topBudget.limit)}.` : 'You can add budgets to unlock sharper advice.'}`;
}

function buildConversationContext(history) {
  if (!history.length) {
    return 'No prior conversation in this chat yet.';
  }

  return history
    .map((entry) => `${entry.role === 'bot' ? 'Assistant' : 'User'}: ${entry.text}`)
    .join('\n');
}

async function getGeminiReply(message, snapshot, history) {
  const config = getConfig();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                'You are a warm, human, concise financial wellness assistant inside a budgeting app. Personalize every answer to the signed-in user by using their name and their actual finance data when available. Avoid sounding robotic, generic, or repetitive. Do not repeat the same opening sentence across turns. Reference specific numbers, categories, budgets, and recent transactions from the provided context when helpful. Keep replies natural and conversational, usually 3 to 6 sentences. Give practical, non-legal, non-investment-advisory guidance, and mention when a CA or licensed advisor is appropriate. If data is missing, say what is missing instead of inventing facts.',
            },
          ],
        },
        generationConfig: {
          temperature: 1,
          topP: 0.95,
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `User finance snapshot:\n${buildFinanceContext(snapshot)}\n\nRecent conversation:\n${buildConversationContext(history)}\n\nCurrent user message: ${message}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed: ${details}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  return reply || 'I could not generate a response right now.';
}

router.post('/', async (req, res) => {
  const message = String(req.body?.message || '').trim();
  const history = sanitizeHistory(req.body?.history);
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const snapshot = await getUserFinanceSnapshot(req.userId);
  const config = getConfig();

  try {
    const reply = config.geminiApiKey
      ? await getGeminiReply(message, snapshot, history)
      : buildMockReply(message, snapshot, history);

    return res.json({
      reply,
      source: config.geminiApiKey ? 'gemini' : 'mock',
    });
  } catch (error) {
    console.error('Chat route failed, falling back to mock response.', error);
    return res.json({
      reply: buildMockReply(message, snapshot, history),
      source: 'mock',
    });
  }
});

module.exports = router;
