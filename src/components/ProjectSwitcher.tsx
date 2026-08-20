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
    <div className="mt-6 border-t border-slate-200 pt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Saved projects</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
        >
          <span className="flex min-w-0 items-center gap-2">
            <FolderOpen className="size-4 shrink-0 text-cyan-600" />
            <span className="truncate">{activeProject?.title ?? 'Select project'}</span>
          </span>
          <ChevronDown className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/80">
            {projects.map((project) => (
              <li key={project.id}>
                {editingId === project.id ? (
                  <div className="flex items-center gap-1 px-2 py-1.5">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                      className="focus-ring min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename()
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                    />
                    <button type="button" onClick={saveRename} aria-label="Save title" className="focus-ring rounded p-1 text-emerald-700 hover:bg-emerald-50">
                      <Check className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} aria-label="Cancel rename" className="focus-ring rounded p-1 text-slate-500 hover:bg-slate-50">
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center ${project.id === activeProjectId ? 'bg-[#ECFEFF]' : ''}`}>
                    <button
                      type="button"
                      onClick={() => { switchProject(project.id); setOpen(false) }}
                      className="focus-ring min-w-0 flex-1 truncate px-3 py-2 text-left text-sm text-slate-700 hover:text-slate-900"
                    >
                      {project.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => startRename(project.id, project.title)}
                      aria-label={`Rename ${project.title}`}
                      className="focus-ring mr-1 rounded p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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
