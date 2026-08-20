import { NotebookPen, Save } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

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
        <PageHeader
          eyebrow="Capture"
          icon={NotebookPen}
          title={<>Project <span className="text-cyan-600">Notes</span></>}
          subtitle="Keep research, decisions, and useful context close to the work they inform."
        />
        <button type="button" onClick={saveNotes} className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700">
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
        className="focus-ring mt-8 min-h-80 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-[15px] leading-7 text-slate-800 placeholder:text-slate-500"
      />
      <p className="mt-3 text-sm text-slate-600" aria-live="polite">{saved ? 'Saved locally on this device.' : 'Notes stay in your browser until you clear them.'}</p>
    </section>
  )
}
