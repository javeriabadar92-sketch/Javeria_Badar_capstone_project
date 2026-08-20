import type { Priority } from '../context/plan-items'
import { cyclePriority } from '../context/plan-items'

const priorityStyles: Record<Priority, string> = {
  high: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
}

const priorityLabels: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

type PriorityTagProps = {
  priority: Priority
  onChange: (priority: Priority) => void
}

export default function PriorityTag({ priority, onChange }: PriorityTagProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(cyclePriority(priority))}
      aria-label={`Priority: ${priorityLabels[priority]}. Click to change.`}
      className={`focus-ring shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${priorityStyles[priority]}`}
    >
      {priorityLabels[priority]}
    </button>
  )
}
