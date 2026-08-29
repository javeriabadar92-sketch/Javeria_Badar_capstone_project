import { NotebookPen, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

type SavedNote = {
  id: string
  text: string
  createdAt: number
}

export default function Notes() {
  const { activeProjectId, activeProjectTitle } = usePlan()
  const [draft, setDraft] = useState('')
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])

  const storageKey = activeProjectId ? `projectpilot-notes-${activeProjectId}` : null

  useEffect(() => {
    if (!storageKey) return
    try {
      const stored = localStorage.getItem(storageKey)
      setSavedNotes(stored ? JSON.parse(stored) : [])
    } catch {
      setSavedNotes([])
    }
    setDraft('')
  }, [storageKey])

  if (!activeProjectId) return <PlanEmptyState title="Capture" icon={NotebookPen} />

  const persist = (notes: SavedNote[]) => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(notes))
    setSavedNotes(notes)
  }

  const saveNote = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    const newNote: SavedNote = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: Date.now(),
    }
    persist([newNote, ...savedNotes])
    setDraft('')
  }

  const deleteNote = (id: string) => {
    persist(savedNotes.filter((note) => note.id !== id))
  }

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Capture"
        icon={NotebookPen}
        title={<>Project <span className="text-cyan-600">Notes</span></>}
        subtitle={`Keep research, decisions, and useful context for ${activeProjectTitle ?? 'this project'}.`}
      />

      <div className="mt-8">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Capture a decision, a question, or the next thing to investigate..."
          aria-label="New note"
          rows={4}
          className="focus-ring w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-[15px] leading-7 text-slate-800 placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={saveNote}
          disabled={!draft.trim()}
          className="focus-ring mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="size-4" aria-hidden="true" /> Save note
        </button>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Saved Notes ({savedNotes.length})
        </p>
        {savedNotes.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing saved yet — write something above and click "Save note".</p>
        ) : (
          <ul className="space-y-3">
            {savedNotes.map((note) => (
              <li key={note.id} className="surface-card group flex items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{note.text}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  aria-label="Delete note"
                  className="focus-ring shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}