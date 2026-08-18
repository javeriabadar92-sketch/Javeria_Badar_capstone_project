import { ListChecks } from 'lucide-react'
import EditableList from '../components/EditableList'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function UserStories() {
  const { plan, updateUserStories } = usePlan()
  if (!plan) return <PlanEmptyState title="Discovery" icon={ListChecks} />

  return (
    <section className="page-shell">
      <p className="eyebrow">Discovery</p>
      <h1 className="page-title">User Stories</h1>
      <p className="page-subtitle">User-centered outcomes to keep implementation grounded in real needs. Click any story to edit.</p>
      <div className="mt-8">
        <EditableList
          items={plan.userStories}
          onChange={updateUserStories}
          variant="card"
          addLabel="+ Add story"
        />
      </div>
    </section>
  )
}
