import { useFinance } from '../context/FinanceContext.jsx'
import { formatInr } from '../utils/money.js'
import {
  monthKey,
  sumExpensesByCategory,
  totalExpensesInMonth,
  totalIncomeInMonth,
} from '../utils/reports.js'

export function ReportsPage() {
  const { expenses, incomes } = useFinance()
  const key = monthKey(new Date())
  const income = totalIncomeInMonth(incomes, key)
  const expense = totalExpensesInMonth(expenses, key)
  const savings = income - expense
  const byCat = sumExpensesByCategory(expenses, key)
  const categories = Object.entries(byCat).sort((a, b) => b[1] - a[1])

  const advice = []
  if (expense > income * 0.9 && income > 0) {
    advice.push('Spending is above 90% of income this month — trim discretionary categories.')
  }
  if (byCat.Entertainment > (byCat.Food || 0) && byCat.Entertainment > 0) {
    advice.push('Entertainment exceeds food spend — consider a weekly cap.')
  }
  if (savings < 0) {
    advice.push('Negative savings: reduce expenses or plan extra income.')
  }
  if (advice.length === 0) {
    advice.push('Keep logging expenses for more personalized tips.')
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Monthly report</h1>
        <p className="page__subtitle">
          {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </header>

      <section className="stats" aria-label="Monthly totals">
        <div className="stat card">
          <span className="stat__label">Income</span>
          <span className="stat__value">{formatInr(income)}</span>
        </div>
        <div className="stat card">
          <span className="stat__label">Expenses</span>
          <span className="stat__value">{formatInr(expense)}</span>
        </div>
        <div className="stat card">
          <span className="stat__label">Savings</span>
          <span className="stat__value stat__value--accent">
            {formatInr(savings)}
          </span>
        </div>
      </section>

      <section className="card">
        <h3 className="card__title">Expenses by category</h3>
        {categories.length === 0 ? (
          <p className="muted">No expenses this month.</p>
        ) : (
          <ul className="bar-list">
            {categories.map(([cat, amt]) => (
              <li key={cat} className="bar-list__row">
                <span>{cat}</span>
                <span className="bar-list__bar-wrap">
                  <span
                    className="bar-list__bar"
                    style={{
                      width: `${Math.min(100, (amt / expense) * 100)}%`,
                    }}
                  />
                </span>
                <span>{formatInr(amt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="callout callout--info">
        <strong>Advice (demo rules)</strong>
        <ul>
          {advice.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
