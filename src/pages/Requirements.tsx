import { ClipboardList } from 'lucide-react'
import EditableList from '../components/EditableList'
import PageHeader from '../components/PageHeader'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function Requirements() {
  const { plan, updateRequirements } = usePlan()
  if (!plan) return <PlanEmptyState title="Plan" icon={ClipboardList} />

  const groups = [
    ['Functional requirements', 'functional' as const],
    ['Non-functional requirements', 'nonFunctional' as const],
  ] as const

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Plan"
        icon={ClipboardList}
        title="Requirements"
        subtitle="The capabilities and quality bar this project needs to meet. Click any item to edit."
      />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {groups.map(([title, key]) => (
          <div key={title} className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-cyan-600">{title}</h2>
            <div className="mt-4">
              <EditableList
                items={plan.requirements[key]}
                onChange={(items) => updateRequirements({ ...plan.requirements, [key]: items })}
                addLabel="+ Add requirement"
                emptyTitle={`No ${key === 'functional' ? 'functional' : 'non-functional'} requirements yet — add one below`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
