import { NotebookPen, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function Notes() {
  const { activeProjectId, activeProjectTitle } = usePlan()
  const [notes, setNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState('')

  const storageKey = activeProjectId ? `projectpilot-notes-${activeProjectId}` : null

  useEffect(() => {
    if (!storageKey) return
    const stored = localStorage.getItem(storageKey) ?? ''
    setNotes(stored)
    setSavedNotes(stored)
  }, [storageKey])

  if (!activeProjectId) return <PlanEmptyState title="Capture" icon={NotebookPen} />

  const isDirty = notes !== savedNotes

  const saveNotes = () => {
    if (!storageKey) return
    localStorage.setItem(storageKey, notes)
    setSavedNotes(notes)
  }

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          eyebrow="Capture"
          icon={NotebookPen}
          title={<>Project <span className="text-cyan-600">Notes</span></>}
          subtitle={`Keep research, decisions, and useful context for ${activeProjectTitle ?? 'this project'}.`}
        />
        <button
          type="button"
          onClick={saveNotes}
          disabled={!isDirty}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="size-4" aria-hidden="true" /> Save notes
        </button>
      </div>

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Capture a decision, a question, or the next thing to investigate..."
        aria-label="Project notes"
        className="focus-ring mt-8 min-h-64 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-[15px] leading-7 text-slate-800 placeholder:text-slate-500"
      />
      <p className="mt-3 text-sm text-slate-600" aria-live="polite">
        {isDirty ? 'You have unsaved changes.' : 'Saved locally on this device.'}
      </p>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Saved Notes</p>
        {savedNotes ? (
          <div className="surface-card whitespace-pre-wrap p-4 text-[15px] leading-7 text-slate-700">
            {savedNotes}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Nothing saved yet — write something above and click "Save notes".</p>
        )}
      </div>
    </section>
  )
}