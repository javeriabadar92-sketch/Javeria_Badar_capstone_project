import { NotebookPen, Save } from 'lucide-react'
import { useState } from 'react'

export default function Notes() {
  const [notes, setNotes] = useState(() => localStorage.getItem('projectpilot-notes') ?? '')
  const [saved, setSaved] = useState(false)

  const saveNotes = () => {
    localStorage.setItem('projectpilot-notes', notes)
    setSaved(true)
  }

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-5 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary" aria-hidden="true"><NotebookPen className="size-6" /></div>
          <p className="eyebrow">Capture</p>
          <h1 className="page-title">Notes</h1>
          <p className="page-subtitle">Keep research, decisions, and useful context close to the work they inform.</p>
        </div>
        <button type="button" onClick={saveNotes} className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10">
          <Save className="size-4" aria-hidden="true" /> Save notes
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value)
          setSaved(false)
        }}
        placeholder="Capture a decision, a question, or the next thing to investigate..."
        aria-label="Project notes"
        className="focus-ring mt-8 min-h-80 w-full resize-y rounded-xl border border-white/15 bg-slate-950/40 p-4 text-[15px] leading-7 text-slate-100 placeholder:text-slate-500"
      />
      <p className="mt-3 text-sm text-slate-400" aria-live="polite">{saved ? 'Saved locally on this device.' : 'Notes stay in your browser until you clear them.'}</p>
    </section>
  )
}
