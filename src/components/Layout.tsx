import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/requirements', label: 'Requirements' },
  { to: '/user-stories', label: 'User Stories' },
  { to: '/features', label: 'Features' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/kanban', label: 'Kanban Board' },
  { to: '/notes', label: 'Notes' },
  { to: '/health-check', label: 'Health Check' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#0F172A] px-4 py-4 shadow-2xl shadow-black/20 backdrop-blur lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold uppercase tracking-[0.4em] text-[#A5B4FC]">
                PROJECTPILOT AI
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-100">
                Planning Workspace
              </h1>
            </div>
            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          <nav className={`${menuOpen ? 'mt-4 flex' : 'hidden'} flex-col gap-2 lg:mt-8 lg:flex`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `relative rounded-xl border-l-2 px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10 text-[#E0E7FF] shadow-sm'
                      : 'border-transparent text-slate-300 hover:border-primary/60 hover:bg-primary/10 hover:text-[#F8FAFC]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 bg-[#111827] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
