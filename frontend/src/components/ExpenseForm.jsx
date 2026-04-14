import { useState } from 'react'
import { expenseCategories } from '../data/placeholder.js'

export function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(expenseCategories[0])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const n = parseFloat(amount, 10)
    if (Number.isNaN(n) || n <= 0) return

    setSubmitting(true)
    try {
      await onAdd({
        amount: n,
        category,
        note: note.trim(),
        date: new Date().toISOString(),
      })
      setAmount('')
      setNote('')
    } catch (err) {
      setError(err.message || 'Unable to save expense')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3 className="card__title">Add expense</h3>
      {error ? <p className="form__error">{error}</p> : null}
      <div className="form__row">
        <label htmlFor="exp-amount">Amount (INR)</label>
        <input
          id="exp-amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          disabled={submitting}
          required
        />
      </div>
      <div className="form__row">
        <label htmlFor="exp-cat">Category</label>
        <select
          id="exp-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={submitting}
        >
          {expenseCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="form__row">
        <label htmlFor="exp-note">Note (optional)</label>
        <input
          id="exp-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
          disabled={submitting}
        />
      </div>
      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Saving...' : 'Add expense'}
      </button>
    </form>
  )
}
