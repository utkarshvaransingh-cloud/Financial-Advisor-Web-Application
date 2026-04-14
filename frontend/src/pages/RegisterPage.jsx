import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function RegisterPage() {
  const { isAuthenticated, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Enter your name.')
      return
    }
    if (!email.trim()) {
      setError('Enter your email.')
      return
    }
    register(name.trim(), email.trim())
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-card__title">Create account</h1>
        <form className="form" onSubmit={handleSubmit}>
          {error ? <p className="form__error">{error}</p> : null}
          <div className="form__row">
            <label htmlFor="reg-name">Name</label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form__row">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form__row">
            <label htmlFor="reg-pass">Password</label>
            <input
              id="reg-pass"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block">
            Register
          </button>
        </form>
        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
