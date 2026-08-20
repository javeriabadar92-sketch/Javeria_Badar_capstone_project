import { ListChecks } from 'lucide-react'
import EditableList from '../components/EditableList'
import PageHeader from '../components/PageHeader'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function UserStories() {
  const { plan, updateUserStories } = usePlan()
  if (!plan) return <PlanEmptyState title="Discovery" icon={ListChecks} />

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Discovery"
        icon={ListChecks}
        title={<>User <span className="text-cyan-600">Stories</span></>}
        subtitle="User-centered outcomes to keep implementation grounded in real needs. Click any story to edit."
      />
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
