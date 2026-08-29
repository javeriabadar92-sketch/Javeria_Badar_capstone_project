import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, FileDown, LayoutDashboard, LoaderCircle, RefreshCw, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import PlanGenerationSkeleton from '../components/PlanGenerationSkeleton'
import { usePlan } from '../context/usePlan'
import { exportPlanPdf } from '../utils/exportPlanPdf'

export default function Overview() {
  const [projectIdea, setProjectIdea] = useState('')
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const { plan, activeProjectTitle, isGenerating, error, generatePlan, regeneratePlan } = usePlan()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    generatePlan(projectIdea)
  }

  const handleRegenerate = () => {
    setShowRegenerateConfirm(false)
    regeneratePlan()
  }

  const handleExportPdf = () => {
    if (!plan) return
    exportPlanPdf(plan, activeProjectTitle ?? undefined)
  }

  return (
    <div className="space-y-6">
      <section className="page-shell">
        <div className="max-w-3xl">
          <PageHeader
            eyebrow="Workspace"
            icon={LayoutDashboard}
            title={<>Turn one idea into a buildable <span className="text-cyan-600">plan</span></>}
            subtitle="Describe your software project and ProjectPilot AI will shape it into requirements, stories, features, a roadmap, and an actionable task board."
          />

          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <label htmlFor="project-idea" className="text-sm font-semibold text-slate-800">Project idea</label>
            <textarea
              id="project-idea"
              value={projectIdea}
              onChange={(event) => setProjectIdea(event.target.value)}
              placeholder="Describe your project idea..."
              rows={3}
              disabled={isGenerating}
              required
              className="focus-ring w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-500"
            />
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-600">Be specific about the users, problem, or platform you have in mind.</p>
              <button type="submit" disabled={isGenerating || !projectIdea.trim()} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:cursor-not-allowed">
                {isGenerating ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
                {isGenerating ? 'Generating plan...' : 'Generate plan'}
                {!isGenerating && <ArrowRight className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </form>

          {isGenerating && <PlanGenerationSkeleton />}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
              <p className="font-semibold">We could not generate that plan.</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </section>

      {plan && (
        <section className="page-shell">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Generated plan</p>
              <h2 className="page-title">A clear starting <span className="text-cyan-600">point</span></h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isGenerating}
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-300 hover:bg-cyan-50/50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileDown className="size-4" aria-hidden="true" />
                Export as PDF
              </button>
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(true)}
                disabled={isGenerating}
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-300 hover:bg-cyan-50/50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Regenerate Plan
              </button>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                <CheckCircle2 className="size-4" aria-hidden="true" /> Ready
              </span>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-[15px] leading-7 text-slate-700">{plan.overview}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Requirements', plan.requirements.functional.length + plan.requirements.nonFunctional.length, 'requirements'],
              ['User stories', plan.userStories.length, 'user stories'],
              ['Features', plan.suggestedFeatures.length, 'suggested features'],
              ['Tasks', plan.kanbanTasks.length, 'kanban tasks'],
            ].map(([label, count, detail]) => (
              <div key={label} className="surface-card p-4">
                <p className="text-sm text-slate-700">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-600">{count}</p>
                <p className="text-xs text-slate-500">{detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {showRegenerateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="regenerate-title">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
            <h3 id="regenerate-title" className="text-lg font-semibold text-slate-900">Regenerate plan?</h3>
            <p className="mt-2 text-sm text-slate-600">This will replace your current plan with a new AI-generated version. Your edits will be lost.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowRegenerateConfirm(false)} className="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={handleRegenerate} className="focus-ring rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/85">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
