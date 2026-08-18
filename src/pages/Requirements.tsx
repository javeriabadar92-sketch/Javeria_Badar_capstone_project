import { ClipboardList } from 'lucide-react'
import EditableList from '../components/EditableList'
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
      <p className="eyebrow">Plan</p>
      <h1 className="page-title">Requirements</h1>
      <p className="page-subtitle">The capabilities and quality bar this project needs to meet. Click any item to edit.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {groups.map(([title, key]) => (
          <div key={title} className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#818CF8]">{title}</h2>
            <div className="mt-4">
              <EditableList
                items={plan.requirements[key]}
                onChange={(items) => updateRequirements({ ...plan.requirements, [key]: items })}
                addLabel="+ Add requirement"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
