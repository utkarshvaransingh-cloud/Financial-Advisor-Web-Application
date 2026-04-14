import { useMemo, useState } from 'react'
import { useFinance } from '../context/FinanceContext.jsx'
import { expenseCategories } from '../data/placeholder.js'
import { formatInr } from '../utils/money.js'
import {
  monthKey,
  sumExpensesByCategory,
  totalExpensesInMonth,
} from '../utils/reports.js'

export function BudgetPage() {
  const { expenses, budgets, updateBudget } = useFinance()
  const key = monthKey(new Date())
  const spentBy = useMemo(
    () => sumExpensesByCategory(expenses, key),
    [expenses, key],
  )
  const monthTotal = totalExpensesInMonth(expenses, key)

  const [category, setCategory] = useState(expenseCategories[0])
  const [limit, setLimit] = useState('')

  function handleSave(e) {
    e.preventDefault()
    const n = parseFloat(limit, 10)
    if (Number.isNaN(n) || n <= 0) return
    updateBudget(category, n)
    setLimit('')
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Budget</h1>
        <p className="page__subtitle">
          Set category limits. Spent this month:{' '}
          <strong>{formatInr(monthTotal)}</strong>
        </p>
      </header>

      <form className="card form budget-form" onSubmit={handleSave}>
        <h3 className="card__title">Update category limit</h3>
        <div className="form__row form__row--inline">
          <label htmlFor="bud-cat">Category</label>
          <select
            id="bud-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {expenseCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form__row form__row--inline">
          <label htmlFor="bud-lim">Monthly limit (₹)</label>
          <input
            id="bud-lim"
            type="number"
            min="0"
            step="1"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="e.g. 5000"
            required
          />
        </div>
        <button type="submit" className="btn btn--primary">
          Save limit
        </button>
      </form>

      <section className="card">
        <h3 className="card__title">Limits vs spent (this month)</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Limit</th>
                <th>Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => {
                const spent = spentBy[b.category] || 0
                const over = spent > b.limit
                return (
                  <tr key={b.id}>
                    <td>{b.category}</td>
                    <td>{formatInr(b.limit)}</td>
                    <td>{formatInr(spent)}</td>
                    <td>
                      {over ? (
                        <span className="pill pill--bad">Over</span>
                      ) : (
                        <span className="pill pill--ok">OK</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
