import { useState } from 'react'
import { expenseCategories } from '../data/placeholder.js'

export function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(expenseCategories[0])
  const [note, setNote] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const n = parseFloat(amount, 10)
    if (Number.isNaN(n) || n <= 0) return
    onAdd({
      amount: n,
      category,
      note: note.trim(),
      date: new Date(),
    })
    setAmount('')
    setNote('')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3 className="card__title">Add expense</h3>
      <div className="form__row">
        <label htmlFor="exp-amount">Amount (₹)</label>
        <input
          id="exp-amount"
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
        <label htmlFor="exp-cat">Category</label>
        <select
          id="exp-cat"
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
      <div className="form__row">
        <label htmlFor="exp-note">Note (optional)</label>
        <input
          id="exp-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
        />
      </div>
      <button type="submit" className="btn btn--primary">
        Add expense
      </button>
    </form>
  )
}
