/** Client-side helpers for Phase 1; server can mirror in Phase 2+. */

export function monthKey(d) {
  const x = d instanceof Date ? d : new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`
}

export function sumExpensesByCategory(expenses, key) {
  return expenses
    .filter((e) => monthKey(e.date) === key)
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})
}

export function totalIncomeInMonth(incomes, key) {
  return incomes
    .filter((i) => monthKey(i.date) === key)
    .reduce((s, i) => s + i.amount, 0)
}

export function totalExpensesInMonth(expenses, key) {
  return expenses
    .filter((e) => monthKey(e.date) === key)
    .reduce((s, e) => s + e.amount, 0)
}

/** Flag small recurring-style expenses (demo heuristic). */
export function ghostExpenseCandidates(expenses, { maxAmount = 100 } = {}) {
  return expenses.filter((e) => e.amount > 0 && e.amount <= maxAmount)
}

/** Flag category spend over budget (returns array of messages). */
export function budgetWarnings(budgets, spentByCategory) {
  const out = []
  for (const b of budgets) {
    const spent = spentByCategory[b.category] || 0
    if (spent > b.limit) {
      out.push(
        `${b.category}: spent ${spent.toFixed(0)} vs limit ${b.limit.toFixed(0)}`,
      )
    }
  }
  return out
}
