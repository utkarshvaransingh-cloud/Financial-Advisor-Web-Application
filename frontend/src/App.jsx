import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FinanceProvider } from './context/FinanceContext.jsx'
import { BudgetPage } from './pages/BudgetPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { ITRModulePage } from './pages/ITRModulePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ReportsPage } from './pages/ReportsPage.jsx'
import './styles/app.css'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/itr" element={<ITRModulePage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppRoutes />
      </FinanceProvider>
    </AuthProvider>
  )
}
