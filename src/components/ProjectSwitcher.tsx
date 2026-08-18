import { useState } from 'react'
import { ChevronDown, FolderOpen, Pencil, Check, X } from 'lucide-react'
import { usePlan } from '../context/usePlan'

export default function ProjectSwitcher() {
  const { projects, activeProjectId, switchProject, updateProjectTitle } = usePlan()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  if (projects.length === 0) return null

  const activeProject = projects.find((p) => p.id === activeProjectId)

  const startRename = (id: string, title: string) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const saveRename = () => {
    if (editingId && editTitle.trim()) {
      updateProjectTitle(editingId, editTitle.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Saved projects</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 transition-colors hover:bg-white/10"
        >
          <span className="flex min-w-0 items-center gap-2">
            <FolderOpen className="size-4 shrink-0 text-primary" />
            <span className="truncate">{activeProject?.title ?? 'Select project'}</span>
          </span>
          <ChevronDown className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0F172A] py-1 shadow-xl shadow-black/40">
            {projects.map((project) => (
              <li key={project.id}>
                {editingId === project.id ? (
                  <div className="flex items-center gap-1 px-2 py-1.5">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                      className="focus-ring min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-950/60 px-2 py-1 text-sm text-slate-100"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename()
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                    />
                    <button type="button" onClick={saveRename} aria-label="Save title" className="focus-ring rounded p-1 text-emerald-300 hover:bg-emerald-400/10">
                      <Check className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} aria-label="Cancel rename" className="focus-ring rounded p-1 text-slate-400 hover:bg-white/10">
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center ${project.id === activeProjectId ? 'bg-primary/10' : ''}`}>
                    <button
                      type="button"
                      onClick={() => { switchProject(project.id); setOpen(false) }}
                      className="focus-ring min-w-0 flex-1 truncate px-3 py-2 text-left text-sm text-slate-200 hover:text-white"
                    >
                      {project.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => startRename(project.id, project.title)}
                      aria-label={`Rename ${project.title}`}
                      className="focus-ring mr-1 rounded p-1.5 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
