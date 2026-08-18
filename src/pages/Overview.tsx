import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, FileDown, LayoutDashboard, LoaderCircle, RefreshCw, Sparkles } from 'lucide-react'
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
          <div className="mb-5 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary" aria-hidden="true">
            <LayoutDashboard className="size-6" />
          </div>
          <p className="eyebrow">Workspace</p>
          <h1 className="page-title">Turn one idea into a buildable plan</h1>
          <p className="page-subtitle">Describe your software project and ProjectPilot AI will shape it into requirements, stories, features, a roadmap, and an actionable task board.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <label htmlFor="project-idea" className="text-sm font-semibold text-slate-200">Project idea</label>
            <textarea
              id="project-idea"
              value={projectIdea}
              onChange={(event) => setProjectIdea(event.target.value)}
              placeholder="Describe your project idea..."
              rows={5}
              disabled={isGenerating}
              required
              className="focus-ring w-full resize-y rounded-xl border border-white/15 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder:text-slate-500"
            />
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-400">Be specific about the users, problem, or platform you have in mind.</p>
              <button type="submit" disabled={isGenerating || !projectIdea.trim()} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:cursor-not-allowed">
                {isGenerating ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
                {isGenerating ? 'Generating plan...' : 'Generate plan'}
                {!isGenerating && <ArrowRight className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </form>

          {isGenerating && (
            <div className="surface-card mt-6 flex items-center gap-3 p-4 text-sm text-slate-300" role="status" aria-live="polite">
              <LoaderCircle className="size-5 animate-spin text-primary" aria-hidden="true" />
              Thinking through your requirements and delivery path...
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-red-200" role="alert">
              <p className="font-semibold">We could not generate that plan.</p>
              <p className="mt-1 text-sm text-red-200/80">{error}</p>
            </div>
          )}
        </div>
      </section>

      {plan && (
        <section className="page-shell">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Generated plan</p>
              <h2 className="page-title">A clear starting point</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isGenerating}
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileDown className="size-4" aria-hidden="true" />
                Export as PDF
              </button>
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(true)}
                disabled={isGenerating}
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Regenerate Plan
              </button>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                <CheckCircle2 className="size-4" aria-hidden="true" /> Ready
              </span>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-[15px] leading-7 text-slate-300">{plan.overview}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Requirements', plan.requirements.functional.length + plan.requirements.nonFunctional.length, 'requirements'],
              ['User stories', plan.userStories.length, 'user stories'],
              ['Features', plan.suggestedFeatures.length, 'suggested features'],
              ['Tasks', plan.kanbanTasks.length, 'kanban tasks'],
            ].map(([label, count, detail]) => (
              <div key={label} className="surface-card p-4">
                <p className="text-sm text-slate-300">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#818CF8]">{count}</p>
                <p className="text-xs text-slate-500">{detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {showRegenerateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="regenerate-title">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl">
            <h3 id="regenerate-title" className="text-lg font-semibold text-slate-100">Regenerate plan?</h3>
            <p className="mt-2 text-sm text-slate-400">This will replace your current plan with a new AI-generated version. Your edits will be lost.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowRegenerateConfirm(false)} className="focus-ring rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
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
