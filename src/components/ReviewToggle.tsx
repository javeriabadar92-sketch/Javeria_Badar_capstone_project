import { Check } from 'lucide-react'

type ReviewToggleProps = {
  reviewed: boolean
  onChange: (reviewed: boolean) => void
  label?: string
}

export default function ReviewToggle({ reviewed, onChange, label = 'Mark as reviewed' }: ReviewToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!reviewed)}
      aria-label={reviewed ? 'Mark as not reviewed' : label}
      aria-pressed={reviewed}
      className={`focus-ring flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
        reviewed
          ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
          : 'border-slate-200 bg-white text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
      }`}
    >
      <Check className={`size-4 ${reviewed ? 'opacity-100' : 'opacity-40'}`} />
    </button>
  )
}
