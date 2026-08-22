import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bot, FolderOpen, LoaderCircle, Sparkles } from 'lucide-react'
import PlanGenerationSkeleton from '../components/PlanGenerationSkeleton'
import { usePlan } from '../context/usePlan'

export default function Landing() {
  const [projectIdea, setProjectIdea] = useState('')
  const navigate = useNavigate()
  const { projects, activeProjectId, isGenerating, error, generatePlan, switchProject } = usePlan()
  const wasGeneratingRef = useRef(false)

  useEffect(() => {
    if (wasGeneratingRef.current && !isGenerating && !error) {
      navigate('/')
    }
    wasGeneratingRef.current = isGenerating
  }, [isGenerating, error, navigate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    generatePlan(projectIdea)
  }

  const continueProject = (projectId: string) => {
    switchProject(projectId)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-cyan-50/40 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center">
        <div className="mb-8 inline-flex rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-600 shadow-sm" aria-hidden="true">
          <Bot className="size-10" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600">ProjectPilot AI</p>
        <h1 className="mt-4 text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Turn your idea into a <span className="text-cyan-600">plan</span>
        </h1>
        <p className="mt-4 max-w-lg text-center text-sm leading-7 text-slate-600 sm:text-[15px]">
          Describe your software project and we&apos;ll shape it into requirements, user stories, features, a roadmap, and an actionable task board.
        </p>

        <div className="surface-card mt-10 w-full p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="landing-project-idea" className="text-sm font-semibold text-slate-800">
              Project idea
            </label>
            <textarea
              id="landing-project-idea"
              value={projectIdea}
              onChange={(event) => setProjectIdea(event.target.value)}
              placeholder="Describe your project idea..."
              rows={5}
              disabled={isGenerating}
              required
              className="focus-ring w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-500"
            />
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-600">Be specific about the users, problem, or platform you have in mind.</p>
              <button
                type="submit"
                disabled={isGenerating || !projectIdea.trim()}
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:cursor-not-allowed"
              >
                {isGenerating ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
                {isGenerating ? 'Generating plan...' : 'Generate Plan'}
                {!isGenerating && <ArrowRight className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </form>

          {isGenerating && <div className="mt-6"><PlanGenerationSkeleton /></div>}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
              <p className="font-semibold">We could not generate that plan.</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {projects.length > 0 && (
          <div className="mt-8 w-full">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Continue a saved project</h2>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="focus-ring text-sm font-medium text-cyan-700 hover:text-cyan-600"
              >
                Skip to workspace →
              </button>
            </div>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => continueProject(project.id)}
                    className={`focus-ring flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      project.id === activeProjectId
                        ? 'border-cyan-300 bg-[#ECFEFF] text-cyan-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/40'
                    }`}
                  >
                    <FolderOpen className="size-4 shrink-0 text-cyan-600" aria-hidden="true" />
                    <span className="truncate font-medium">{project.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}