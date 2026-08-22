import { CheckCircle2 } from 'lucide-react'
import EditableList from '../components/EditableList'
import PageHeader from '../components/PageHeader'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function Features() {
  const { plan, updateSuggestedFeatures } = usePlan()
  if (!plan) return <PlanEmptyState title="Shape" icon={CheckCircle2} />

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Shape"
        icon={CheckCircle2}
        title={<>Suggested <span className="text-cyan-600">Features</span></>}
        subtitle="Potential product capabilities to evaluate and prioritize. Click any feature to edit."
      />
      <div className="mt-8">
        <EditableList
          items={plan.suggestedFeatures}
          onChange={updateSuggestedFeatures}
          variant="feature"
          addLabel="Add feature"
          emptyTitle="No features yet — add one below"
        />
      </div>
    </section>
  )
}
