/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext.jsx'
import { apiRequest } from '../utils/api.js'

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const { token, isAuthenticated, authReady } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadFinance() {
      if (!authReady) return
      if (!isAuthenticated || !token) {
        setExpenses([])
        setIncomes([])
        setBudgets([])
        setLoading(false)
        setError('')
        return
      }

      setLoading(true)
      setError('')

      try {
        const data = await apiRequest('/finance/bootstrap', { token })
        if (!cancelled) {
          setExpenses(data.expenses || [])
          setIncomes(data.incomes || [])
          setBudgets(data.budgets || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load finance data')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadFinance()

    return () => {
      cancelled = true
    }
  }, [authReady, isAuthenticated, token])

  const addExpense = useCallback(async (payload) => {
    const data = await apiRequest('/finance/expenses', {
      method: 'POST',
      token,
      body: payload,
    })
    setExpenses((prev) => [data.expense, ...prev])
    return data.expense
  }, [token])

  const addIncome = useCallback(async (payload) => {
    const data = await apiRequest('/finance/incomes', {
      method: 'POST',
      token,
      body: payload,
    })
    setIncomes((prev) => [data.income, ...prev])
    return data.income
  }, [token])

  const updateBudget = useCallback(async (category, limit) => {
    const data = await apiRequest(`/finance/budgets/${encodeURIComponent(category)}`, {
      method: 'PUT',
      token,
      body: { category, limit },
    })
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === category)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = data.budget
        return next
      }
      return [...prev, data.budget].sort((a, b) => a.category.localeCompare(b.category))
    })
    return data.budget
  }, [token])

  const value = useMemo(
    () => ({
      expenses,
      incomes,
      budgets,
      loading,
      error,
      addExpense,
      addIncome,
      updateBudget,
    }),
    [expenses, incomes, budgets, loading, error, addExpense, addIncome, updateBudget],
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
