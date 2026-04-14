import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Enter your email.')
      return
    }
    login(email.trim())
    navigate(from, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-card__title">Sign in</h1>
        <p className="auth-card__hint">
          Phase 1 demo: any email/password works. Data stays in this browser
          session.
        </p>
        <form className="form" onSubmit={handleSubmit}>
          {error ? <p className="form__error">{error}</p> : null}
          <div className="form__row">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form__row">
            <label htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block">
            Sign in
          </button>
        </form>
        <p className="auth-card__footer">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
