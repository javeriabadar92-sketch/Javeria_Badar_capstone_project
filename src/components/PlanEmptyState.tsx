import type { LucideIcon } from 'lucide-react'

type PlanEmptyStateProps = {
  icon: LucideIcon
  title: string
}

export default function PlanEmptyState({ icon: Icon, title }: PlanEmptyStateProps) {
  return (
    <section className="page-shell">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-5 inline-flex rounded-xl border border-cyan-800 bg-cyan-50 p-3 text-cyan-800" aria-hidden="true">
          <Icon className="size-6" />
        </div>
        <p className="eyebrow">{title}</p>
        <h1 className="page-title">Your plan is <span className="text-cyan-800">waiting</span></h1>
        <p className="page-subtitle">Generate a plan from the Overview page first, then return here to explore this part of your project.</p>
      </div>
    </section>
  )
}
