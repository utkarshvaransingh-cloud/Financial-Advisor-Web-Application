/** Sample data for Phase 1 (replaced by API in Phase 3). */

export const initialExpenses = [
  {
    id: 'e1',
    amount: 320,
    category: 'Food',
    note: 'Groceries',
    date: new Date('2026-03-01'),
  },
  {
    id: 'e2',
    amount: 45,
    category: 'Transport',
    note: 'Metro',
    date: new Date('2026-03-05'),
  },
  {
    id: 'e3',
    amount: 29,
    category: 'Subscriptions',
    note: 'Streaming',
    date: new Date('2026-03-10'),
  },
  {
    id: 'e4',
    amount: 8500,
    category: 'Food',
    note: 'Dining out',
    date: new Date('2026-03-12'),
  },
]

export const initialIncomes = [
  {
    id: 'i1',
    amount: 55000,
    source: 'Salary',
    date: new Date('2026-03-01'),
  },
]

export const initialBudgets = [
  { id: 'b1', category: 'Food', limit: 8000 },
  { id: 'b2', category: 'Transport', limit: 3000 },
  { id: 'b3', category: 'Subscriptions', limit: 500 },
]

export const expenseCategories = [
  'Food',
  'Transport',
  'Utilities',
  'Subscriptions',
  'Healthcare',
  'Entertainment',
  'Other',
]
