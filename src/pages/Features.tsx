import { Sparkles } from 'lucide-react'
import EditableList from '../components/EditableList'
import PlanEmptyState from '../components/PlanEmptyState'
import { usePlan } from '../context/usePlan'

export default function Features() {
  const { plan, updateSuggestedFeatures } = usePlan()
  if (!plan) return <PlanEmptyState title="Shape" icon={Sparkles} />

  return (
    <section className="page-shell">
      <p className="eyebrow">Shape</p>
      <h1 className="page-title">Suggested Features</h1>
      <p className="page-subtitle">Potential product capabilities to evaluate and prioritize. Click any feature to edit.</p>
      <div className="mt-8">
        <EditableList
          items={plan.suggestedFeatures}
          onChange={updateSuggestedFeatures}
          variant="feature"
          addLabel="+ Add feature"
        />
      </div>
    </section>
  )
}
