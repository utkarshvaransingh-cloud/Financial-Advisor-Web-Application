import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute() {
  const { isAuthenticated, authReady } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return <div className="page"><p className="muted">Checking your session...</p></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
