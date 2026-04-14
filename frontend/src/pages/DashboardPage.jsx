import { ExpenseForm } from '../components/ExpenseForm.jsx'
import { IncomeForm } from '../components/IncomeForm.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatInr } from '../utils/money.js'
import {
  budgetWarnings,
  ghostExpenseCandidates,
  monthKey,
  sumExpensesByCategory,
  totalExpensesInMonth,
  totalIncomeInMonth,
} from '../utils/reports.js'

export function DashboardPage() {
  const { expenses, incomes, budgets, addExpense, addIncome } = useFinance()
  const now = new Date()
  const key = monthKey(now)
  const incomeTotal = totalIncomeInMonth(incomes, key)
  const expenseTotal = totalExpensesInMonth(expenses, key)
  const savings = incomeTotal - expenseTotal
  const spentBy = sumExpensesByCategory(expenses, key)
  const warnings = budgetWarnings(budgets, spentBy)
  const ghosts = ghostExpenseCandidates(expenses)

  const recent = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div className="page dashboard">
      <header className="page__header">
        <h1 className="page__title">Dashboard</h1>
        <p className="page__subtitle">This month at a glance</p>
      </header>

      <section className="stats" aria-label="Summary">
        <div className="stat card">
          <span className="stat__label">Income</span>
          <span className="stat__value">{formatInr(incomeTotal)}</span>
        </div>
        <div className="stat card">
          <span className="stat__label">Expenses</span>
          <span className="stat__value">{formatInr(expenseTotal)}</span>
        </div>
        <div className="stat card">
          <span className="stat__label">Savings</span>
          <span className="stat__value stat__value--accent">
            {formatInr(savings)}
          </span>
        </div>
      </section>

      {warnings.length > 0 ? (
        <section className="callout callout--warn" role="status">
          <strong>Budget alerts:</strong>
          <ul>
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {ghosts.length > 0 ? (
        <section className="callout callout--info" role="status">
          <strong>Small expenses to review (ghost candidates):</strong>
          <ul>
            {ghosts.map((g) => (
              <li key={g.id}>
                {formatInr(g.amount)} — {g.category}
                {g.note ? ` (${g.note})` : ''}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="dashboard__grid">
        <ExpenseForm onAdd={addExpense} />
        <IncomeForm onAdd={addIncome} />
      </div>

      <section className="card">
        <h3 className="card__title">Recent expenses</h3>
        {recent.length === 0 ? (
          <p className="muted">No expenses yet.</p>
        ) : (
          <ul className="list-plain">
            {recent.map((e) => (
              <li key={e.id} className="list-plain__row">
                <span>{formatInr(e.amount)}</span>
                <span>{e.category}</span>
                <span className="muted">
                  {new Date(e.date).toLocaleDateString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
