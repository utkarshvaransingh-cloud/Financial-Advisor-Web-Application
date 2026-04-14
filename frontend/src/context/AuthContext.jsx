/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { apiRequest, clearStoredAuth, getStoredAuth, storeAuth } from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth())
  const [authReady, setAuthReady] = useState(false)

  const persistAuth = useCallback((next) => {
    storeAuth(next)
    setAuth(next)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      if (!auth?.token) {
        setAuthReady(true)
        return
      }

      try {
        const data = await apiRequest('/auth/me', { token: auth.token })
        if (!cancelled) {
          persistAuth({ token: auth.token, user: data.user })
        }
      } catch {
        if (!cancelled) {
          clearStoredAuth()
          setAuth(null)
        }
      } finally {
        if (!cancelled) {
          setAuthReady(true)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [auth?.token, persistAuth])

  const login = useCallback(async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    persistAuth(data)
    return data.user
  }, [persistAuth])

  const register = useCallback(async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    persistAuth(data)
    return data.user
  }, [persistAuth])

  const logout = useCallback(() => {
    clearStoredAuth()
    setAuth(null)
  }, [])

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      authReady,
      isAuthenticated: Boolean(auth?.token && auth?.user),
      login,
      register,
      logout,
    }),
    [auth, authReady, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
