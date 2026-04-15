import { Outlet } from 'react-router-dom'
import { AiChatbot } from './AiChatbot.jsx'
import { AppNav } from './AppNav.jsx'

export function AppShell() {
  return (
    <div className="app-shell">
      <AppNav />
      <main className="app-main">
        <Outlet />
      </main>
      <AiChatbot />
    </div>
  )
}
