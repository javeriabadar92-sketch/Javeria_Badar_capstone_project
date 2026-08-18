import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Bot, CheckCircle2, ClipboardList, KanbanSquare, ListChecks, Map, Menu, MessageSquare, NotebookPen, X } from 'lucide-react'
import ProjectSwitcher from './ProjectSwitcher'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/requirements', label: 'Requirements' },
  { to: '/user-stories', label: 'User Stories' },
  { to: '/features', label: 'Features' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/kanban', label: 'Kanban Board' },
  { to: '/notes', label: 'Notes' },
  { to: '/health-check', label: 'Health Check' },
  { to: '/playground', label: 'Playground' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#0F172A]/95 px-4 py-4 shadow-2xl shadow-black/20 backdrop-blur lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                PROJECTPILOT AI
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-100">
                Planning Workspace
              </h1>
            </div>
            <button
              type="button"
              className="focus-ring rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 transition-colors hover:bg-white/10 lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>

          <nav className={`${menuOpen ? 'mt-4 grid grid-rows-[1fr] opacity-100' : 'grid grid-rows-[0fr] opacity-0'} overflow-hidden transition-[grid-template-rows,opacity] duration-300 lg:mt-8 lg:grid lg:grid-rows-[1fr] lg:opacity-100`}>
            <div className="flex min-h-0 flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `focus-ring relative flex items-center rounded-xl border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/10 text-[#E0E7FF] shadow-sm'
                      : 'border-transparent text-slate-300 hover:border-primary/60 hover:bg-primary/10 hover:text-[#F8FAFC]'
                  }`
                }
              >
                {item.to === '/' && <Bot className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/requirements' && <ClipboardList className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/user-stories' && <ListChecks className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/features' && <CheckCircle2 className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/roadmap' && <Map className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/kanban' && <KanbanSquare className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/notes' && <NotebookPen className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/health-check' && <CheckCircle2 className="mr-2 size-4" aria-hidden="true" />}
                {item.to === '/playground' && <MessageSquare className="mr-2 size-4" aria-hidden="true" />}
                {item.label}
              </NavLink>
            ))}
            </div>
          </nav>

          <ProjectSwitcher />
        </aside>

        <main className="min-w-0 flex-1 bg-[#111827] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
