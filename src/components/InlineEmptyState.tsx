import type { LucideIcon } from 'lucide-react'

type InlineEmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
}

export default function InlineEmptyState({ icon: Icon, title, description }: InlineEmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
      <Icon className="size-7 text-cyan-800" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-slate-700">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
    </div>
  )
}
