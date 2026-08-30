import { Map } from 'lucide-react'
import InlineEmptyState from '../components/InlineEmptyState'
import PageHeader from '../components/PageHeader'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function Roadmap() {
  const { plan } = usePlan()
  if (!plan) return <PlanEmptyState title="Sequence" icon={Map} />

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Sequence"
        icon={Map}
        title={<>Development <span className="text-cyan-800">Roadmap</span></>}
        subtitle="A practical sequence of milestones from first setup to release."
      />
      <div className="relative mt-8 space-y-5 before:absolute before:bottom-6 before:left-[11px] before:top-6 before:w-px before:bg-cyan-800/30">
        {plan.roadmap.length === 0 && (
          <InlineEmptyState
            icon={Map}
            title="No roadmap milestones yet"
            description="Your generated plan will appear here once milestones are available."
          />
        )}
        {plan.roadmap.map((item, index) => (
          <article key={`${item.phase}-${index}`} className="relative flex gap-4">
            <span className="relative mt-1.5 size-6 shrink-0 rounded-full border-4 border-white bg-cyan-800" aria-hidden="true" />
            <div className="surface-card min-w-0 flex-1 p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-800">Phase {index + 1}</span>
              <h2 className="mt-2 text-lg font-semibold text-cyan-800">{item.phase}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
