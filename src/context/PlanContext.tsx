import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { PlanContext } from './plan-context'

export type RequirementSet = {
  functional: string[]
  nonFunctional: string[]
}

export type RoadmapItem = {
  phase: string
  description: string
}

export type KanbanStatus = 'todo' | 'inProgress' | 'done'

export type KanbanTask = {
  title: string
  status: KanbanStatus
}

export type ProjectPlan = {
  projectIdea: string
  overview: string
  requirements: RequirementSet
  userStories: string[]
  suggestedFeatures: string[]
  roadmap: RoadmapItem[]
  kanbanTasks: KanbanTask[]
}

export type SavedProject = {
  id: string
  title: string
  plan: ProjectPlan
  createdAt: number
}

type ProjectsState = {
  projects: SavedProject[]
  activeProjectId: string | null
}

const STORAGE_KEY = 'projectpilot-projects'

const PLAN_PROMPT = `You are ProjectPilot AI. Turn the student's project idea below into a practical software engineering plan.
Return ONLY valid JSON. Do not include markdown fences, commentary, or extra keys.
Use exactly this shape:
{
  "overview": "string",
  "requirements": {
    "functional": ["string"],
    "nonFunctional": ["string"]
  },
  "userStories": ["string"],
  "suggestedFeatures": ["string"],
  "roadmap": [{"phase": "string", "description": "string"}],
  "kanbanTasks": [{"title": "string", "status": "todo"}]
}
Every kanban status must be exactly "todo", "inProgress", or "done". Keep the plan specific, concise, and useful for a Software Engineering student.

Student project idea:
`

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []
}

function parsePlan(text: string, projectIdea: string): ProjectPlan {
  const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const raw = JSON.parse(jsonText) as Record<string, unknown>
  const rawRequirements = raw.requirements as Record<string, unknown> | undefined
  const rawTasks = Array.isArray(raw.kanbanTasks) ? raw.kanbanTasks : []

  return {
    projectIdea,
    overview: typeof raw.overview === 'string' ? raw.overview : 'A structured plan for your project.',
    requirements: {
      functional: asStringArray(rawRequirements?.functional),
      nonFunctional: asStringArray(rawRequirements?.nonFunctional),
    },
    userStories: asStringArray(raw.userStories),
    suggestedFeatures: asStringArray(raw.suggestedFeatures),
    roadmap: Array.isArray(raw.roadmap)
      ? raw.roadmap.flatMap((item) => {
          if (!item || typeof item !== 'object') return []
          const roadmapItem = item as Record<string, unknown>
          return typeof roadmapItem.phase === 'string' && typeof roadmapItem.description === 'string'
            ? [{ phase: roadmapItem.phase, description: roadmapItem.description }]
            : []
        })
      : [],
    kanbanTasks: rawTasks.flatMap((item) => {
      if (!item || typeof item !== 'object') return []
      const task = item as Record<string, unknown>
      const status = task.status
      return typeof task.title === 'string' && (status === 'todo' || status === 'inProgress' || status === 'done')
        ? [{ title: task.title, status }]
        : []
    }),
  }
}

function deriveTitle(idea: string): string {
  const words = idea.trim().split(/\s+/)
  const title = words.slice(0, 5).join(' ')
  return words.length > 5 ? `${title}…` : title
}

function loadProjects(): ProjectsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { projects: [], activeProjectId: null }
    const parsed = JSON.parse(raw) as ProjectsState
    if (!Array.isArray(parsed.projects)) return { projects: [], activeProjectId: null }
    return parsed
  } catch {
    return { projects: [], activeProjectId: null }
  }
}

function saveProjects(state: ProjectsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [projectsState, setProjectsState] = useState<ProjectsState>(loadProjects)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const activeIdeaRef = useRef('')
  const regeneratingRef = useRef(false)
  const activeProjectIdRef = useRef<string | null>(null)

  useEffect(() => {
    saveProjects(projectsState)
    activeProjectIdRef.current = projectsState.activeProjectId
  }, [projectsState])

  const activeProject = projectsState.projects.find((p) => p.id === projectsState.activeProjectId) ?? null
  const plan = activeProject?.plan ?? null

  const updateActivePlan = useCallback((updater: (current: ProjectPlan) => ProjectPlan) => {
    setProjectsState((prev) => {
      if (!prev.activeProjectId) return prev
      return {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === prev.activeProjectId ? { ...p, plan: updater(p.plan) } : p,
        ),
      }
    })
  }, [])

  const handlePlanGenerated = useCallback((parsedPlan: ProjectPlan, idea: string, replaceId?: string) => {
    if (replaceId) {
      setProjectsState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === replaceId ? { ...p, plan: parsedPlan } : p,
        ),
      }))
    } else {
      const newProject: SavedProject = {
        id: crypto.randomUUID(),
        title: deriveTitle(idea),
        plan: parsedPlan,
        createdAt: Date.now(),
      }
      setProjectsState((prev) => ({
        projects: [newProject, ...prev.projects],
        activeProjectId: newProject.id,
      }))
    }
    setGenerationError(null)
    regeneratingRef.current = false
  }, [])

  const { sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat', body: { mode: 'plan' } }),
    onFinish: ({ message, isError }) => {
      if (isError) {
        regeneratingRef.current = false
        return
      }
      const text = message.parts
        .filter((part): part is Extract<typeof part, { type: 'text' }> => part.type === 'text')
        .map((part) => part.text)
        .join('')

      try {
        const parsedPlan = parsePlan(text, activeIdeaRef.current)
        if (regeneratingRef.current && activeProjectIdRef.current) {
          handlePlanGenerated(parsedPlan, activeIdeaRef.current, activeProjectIdRef.current)
        } else {
          handlePlanGenerated(parsedPlan, activeIdeaRef.current)
        }
      } catch {
        setGenerationError('The AI returned an incomplete plan. Please try again.')
        regeneratingRef.current = false
      }
    },
    onError: (requestError) => {
      setGenerationError(requestError.message || 'Unable to generate a plan right now.')
      regeneratingRef.current = false
    },
  })

  const generatePlan = (projectIdea: string) => {
    const trimmedIdea = projectIdea.trim()
    if (!trimmedIdea) return
    activeIdeaRef.current = trimmedIdea
    setGenerationError(null)
    regeneratingRef.current = false
    sendMessage({ text: `${PLAN_PROMPT}\n${trimmedIdea}` })
  }

  const regeneratePlan = () => {
    if (!plan) return
    activeIdeaRef.current = plan.projectIdea
    setGenerationError(null)
    regeneratingRef.current = true
    sendMessage({ text: `${PLAN_PROMPT}\n${plan.projectIdea}` })
  }

  const switchProject = (id: string) => {
    setProjectsState((prev) => ({ ...prev, activeProjectId: id }))
  }

  const updateProjectTitle = (id: string, title: string) => {
    setProjectsState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, title } : p)),
    }))
  }

  const updateKanbanTasks = (tasks: KanbanTask[]) => {
    updateActivePlan((current) => ({ ...current, kanbanTasks: tasks }))
  }

  const updateRequirements = (requirements: RequirementSet) => {
    updateActivePlan((current) => ({ ...current, requirements }))
  }

  const updateUserStories = (userStories: string[]) => {
    updateActivePlan((current) => ({ ...current, userStories }))
  }

  const updateSuggestedFeatures = (suggestedFeatures: string[]) => {
    updateActivePlan((current) => ({ ...current, suggestedFeatures }))
  }

  const value = {
    plan,
    projects: projectsState.projects,
    activeProjectId: projectsState.activeProjectId,
    activeProjectTitle: activeProject?.title ?? null,
    isGenerating: status === 'submitted' || status === 'streaming',
    error: generationError || error?.message || null,
    generatePlan,
    regeneratePlan,
    switchProject,
    updateProjectTitle,
    updateKanbanTasks,
    updateRequirements,
    updateUserStories,
    updateSuggestedFeatures,
  }

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}
