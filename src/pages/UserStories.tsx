import { ListChecks } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import PlanEmptyState from '../components/PlanEmptyState'
import UserStoryList from '../components/UserStoryList'
import { usePlan } from '../context/usePlan'

export default function UserStories() {
  const { plan, updateUserStories, suggestAcceptanceCriteria, generatingCriteriaForStoryId } = usePlan()
  if (!plan) return <PlanEmptyState title="Discovery" icon={ListChecks} />

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Discovery"
        icon={ListChecks}
        title={<>User <span className="text-cyan-800">Stories</span></>}
        subtitle="User-centered outcomes to keep implementation grounded in real needs. Click any story to edit, expand for acceptance criteria."
      />
      <div className="mt-8">
        <UserStoryList
          items={plan.userStories}
          onChange={updateUserStories}
          onSuggestCriteria={suggestAcceptanceCriteria}
          generatingCriteriaForStoryId={generatingCriteriaForStoryId}
          addLabel="Add story"
        />
      </div>
    </section>
  )
}
