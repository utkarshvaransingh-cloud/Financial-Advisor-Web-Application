import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/budget', label: 'Budget' },
  { to: '/reports', label: 'Reports' },
  { to: '/itr', label: 'ITR guide' },
]

export function AppNav() {
  const { user, logout } = useAuth()

  return (
    <header className="app-nav">
      <div className="app-nav__brand">
        <NavLink to="/dashboard" className="app-nav__logo">
          Financial Advisor
        </NavLink>
      </div>
      <nav className="app-nav__links" aria-label="Main">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="app-nav__user">
        <span className="app-nav__name">{user?.name}</span>
        <button type="button" className="app-nav__logout" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  )
}
