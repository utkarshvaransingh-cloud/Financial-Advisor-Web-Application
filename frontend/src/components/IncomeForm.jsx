import { useState } from 'react'

export function IncomeForm({ onAdd }) {
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('Salary')
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
        source: source.trim() || 'Income',
        date: new Date().toISOString(),
      })
      setAmount('')
    } catch (err) {
      setError(err.message || 'Unable to save income')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3 className="card__title">Add income</h3>
      {error ? <p className="form__error">{error}</p> : null}
      <div className="form__row">
        <label htmlFor="inc-amount">Amount (INR)</label>
        <input
          id="inc-amount"
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
        <label htmlFor="inc-src">Source</label>
        <input
          id="inc-src"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Salary, freelance"
          disabled={submitting}
        />
      </div>
      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Saving...' : 'Add income'}
      </button>
    </form>
  )
}
