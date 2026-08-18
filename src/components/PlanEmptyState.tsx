import type { LucideIcon } from 'lucide-react'

type PlanEmptyStateProps = {
  icon: LucideIcon
  title: string
}

export default function PlanEmptyState({ icon: Icon, title }: PlanEmptyStateProps) {
  return (
    <section className="page-shell">
      <div className="max-w-xl">
        <div className="mb-5 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary" aria-hidden="true">
          <Icon className="size-6" />
        </div>
        <p className="eyebrow">{title}</p>
        <h1 className="page-title">Your plan is waiting</h1>
        <p className="page-subtitle">Generate a plan from the Overview page first, then return here to explore this part of your project.</p>
      </div>
    </section>
  )
}
