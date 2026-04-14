/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  initialBudgets,
  initialExpenses,
  initialIncomes,
} from '../data/placeholder.js'

const FinanceContext = createContext(null)

function newId() {
  return crypto.randomUUID()
}

export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [incomes, setIncomes] = useState(initialIncomes)
  const [budgets, setBudgets] = useState(initialBudgets)

  const addExpense = useCallback((payload) => {
    setExpenses((prev) => [
      ...prev,
      {
        id: newId(),
        amount: payload.amount,
        category: payload.category,
        note: payload.note || '',
        date: payload.date instanceof Date ? payload.date : new Date(payload.date),
      },
    ])
  }, [])

  const addIncome = useCallback((payload) => {
    setIncomes((prev) => [
      ...prev,
      {
        id: newId(),
        amount: payload.amount,
        source: payload.source,
        date: payload.date instanceof Date ? payload.date : new Date(payload.date),
      },
    ])
  }, [])

  const updateBudget = useCallback((category, limit) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === category)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], limit }
        return next
      }
      return [...prev, { id: newId(), category, limit }]
    })
  }, [])

  const value = useMemo(
    () => ({
      expenses,
      incomes,
      budgets,
      addExpense,
      addIncome,
      updateBudget,
    }),
    [expenses, incomes, budgets, addExpense, addIncome, updateBudget],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
