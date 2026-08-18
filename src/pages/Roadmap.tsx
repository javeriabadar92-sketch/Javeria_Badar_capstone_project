import { Map } from 'lucide-react'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function Roadmap() {
  const { plan } = usePlan()
  if (!plan) return <PlanEmptyState title="Sequence" icon={Map} />

  return (
    <section className="page-shell">
      <p className="eyebrow">Sequence</p>
      <h1 className="page-title">Development Roadmap</h1>
      <p className="page-subtitle">A practical sequence of milestones from first setup to release.</p>
      <div className="relative mt-8 space-y-5 before:absolute before:bottom-6 before:left-[11px] before:top-6 before:w-px before:bg-[#818CF8]/30">
        {plan.roadmap.map((item, index) => (
          <article key={`${item.phase}-${index}`} className="relative flex gap-4">
            <span className="relative mt-1.5 size-6 shrink-0 rounded-full border-4 border-slate-900 bg-[#818CF8]" aria-hidden="true" />
            <div className="surface-card min-w-0 flex-1 p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Phase {index + 1}</span>
              <h2 className="mt-2 text-lg font-semibold text-[#818CF8]">{item.phase}</h2>
              <p className="mt-2 text-sm leading-6 text-[#E2E8F0]">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
