import { useState } from 'react'
import { FolderOpen, Pencil, Check, X, Trash2 } from 'lucide-react'
import { usePlan } from '../context/usePlan'

export default function ProjectSwitcher() {
  const { projects, activeProjectId, switchProject, updateProjectTitle, deleteProject } = usePlan()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  if (projects.length === 0) return null

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

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteProject(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="mt-6 border-t border-slate-200 pt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Saved projects ({projects.length})
        </p>
        <ul className="max-h-64 space-y-1 overflow-y-auto">
          {projects.map((project) => (
            <li key={project.id}>
              {editingId === project.id ? (
                <div className="flex items-center gap-1 px-1 py-1">
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
                <div
                  className={`group flex items-center rounded-xl border transition-colors ${
                    project.id === activeProjectId
                      ? 'border-cyan-300 bg-[#ECFEFF]'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => switchProject(project.id)}
                    className="focus-ring flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left text-sm"
                  >
                    <FolderOpen className={`size-4 shrink-0 ${project.id === activeProjectId ? 'text-cyan-600' : 'text-slate-400'}`} />
                    <span className={`truncate ${project.id === activeProjectId ? 'font-semibold text-cyan-800' : 'text-slate-700'}`}>
                      {project.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startRename(project.id, project.title)}
                    aria-label={`Rename ${project.title}`}
                    className="focus-ring rounded p-1.5 text-slate-500 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: project.id, title: project.title })}
                    aria-label={`Delete ${project.title}`}
                    className="focus-ring mr-1 rounded p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
            <h3 id="delete-project-title" className="text-lg font-semibold text-slate-900">Delete this project?</h3>
            <p className="mt-2 text-sm text-slate-600">
              &ldquo;{deleteTarget.title}&rdquo; will be removed from your saved projects. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="focus-ring rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}