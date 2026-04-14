import { useState } from 'react'

export function IncomeForm({ onAdd }) {
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('Salary')

  function handleSubmit(e) {
    e.preventDefault()
    const n = parseFloat(amount, 10)
    if (Number.isNaN(n) || n <= 0) return
    onAdd({
      amount: n,
      source: source.trim() || 'Income',
      date: new Date(),
    })
    setAmount('')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3 className="card__title">Add income</h3>
      <div className="form__row">
        <label htmlFor="inc-amount">Amount (₹)</label>
        <input
          id="inc-amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
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
          placeholder="Salary, freelance…"
        />
      </div>
      <button type="submit" className="btn btn--primary">
        Add income
      </button>
    </form>
  )
}
