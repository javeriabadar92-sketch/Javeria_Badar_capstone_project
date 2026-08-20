import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { PlanContext } from './plan-context'
import {
  createPlanItem,
  createUserStoryItem,
  normalizePlanItems,
  normalizeUserStoryItems,
  parseAcceptanceCriteria,
  type PlanItem,
  type UserStoryItem,
} from './plan-items'

export type RequirementSet = {
  functional: PlanItem[]
  nonFunctional: PlanItem[]
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
  userStories: UserStoryItem[]
  suggestedFeatures: PlanItem[]
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

type GenerationIntent = 'create' | 'regenerate'

const STORAGE_KEY = 'projectpilot-projects'
const RATE_LIMIT_MESSAGE = "We've hit a temporary usage limit. Please wait a minute and try again."

function isRateLimitError(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error)
  const normalizedText = text.toLowerCase()
  return normalizedText.includes('rate limit') || normalizedText.includes('quota') || normalizedText.includes('429') || normalizedText.includes('resource_exhausted')
}

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

const ACCEPTANCE_CRITERIA_PROMPT = `Return ONLY valid JSON with no markdown fences or extra keys.
Use exactly this shape: {"acceptanceCriteria":["string"]}
Provide 3-4 specific, testable acceptance criteria bullet points for this user story:`

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
      functional: asStringArray(rawRequirements?.functional).map((item) => createPlanItem(item)),
      nonFunctional: asStringArray(rawRequirements?.nonFunctional).map((item) => createPlanItem(item)),
    },
    userStories: asStringArray(raw.userStories).map((item) => createUserStoryItem(item)),
    suggestedFeatures: asStringArray(raw.suggestedFeatures).map((item) => createPlanItem(item)),
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

function migratePlan(plan: ProjectPlan): ProjectPlan {
  return {
    ...plan,
    requirements: {
      functional: normalizePlanItems(plan.requirements?.functional),
      nonFunctional: normalizePlanItems(plan.requirements?.nonFunctional),
    },
    userStories: normalizeUserStoryItems(plan.userStories),
    suggestedFeatures: normalizePlanItems(plan.suggestedFeatures),
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

    const projects = parsed.projects.map((project) => ({
      ...project,
      plan: migratePlan(project.plan),
    }))

    const activeProjectId = projects.some((project) => project.id === parsed.activeProjectId)
      ? parsed.activeProjectId
      : projects[0]?.id ?? null

    return { projects, activeProjectId }
  } catch {
    return { projects: [], activeProjectId: null }
  }
}

function saveProjects(state: ProjectsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save projects to localStorage:', error)
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [projectsState, setProjectsState] = useState<ProjectsState>(loadProjects)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generatingCriteriaForStoryId, setGeneratingCriteriaForStoryId] = useState<string | null>(null)

  const activeIdeaRef = useRef('')
  const generationIntentRef = useRef<GenerationIntent>('create')
  const pendingGenerationIdRef = useRef<number | null>(null)
  const generationCounterRef = useRef(0)
  const activeProjectIdRef = useRef<string | null>(null)
  const criteriaStoryIdRef = useRef<string | null>(null)

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
          p.id === prev.activeProjectId ? { ...p, plan: migratePlan(updater(p.plan)) } : p,
        ),
      }
    })
  }, [])

  const handlePlanGenerated = useCallback((parsedPlan: ProjectPlan, idea: string, replaceId?: string) => {
    const migratedPlan = migratePlan(parsedPlan)

    if (replaceId) {
      setProjectsState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === replaceId ? { ...p, plan: migratedPlan, title: deriveTitle(idea) } : p,
        ),
      }))
    } else {
      const newProject: SavedProject = {
        id: crypto.randomUUID(),
        title: deriveTitle(idea),
        plan: migratedPlan,
        createdAt: Date.now(),
      }
      setProjectsState((prev) => ({
        projects: [newProject, ...prev.projects.filter((project) => project.id !== newProject.id)],
        activeProjectId: newProject.id,
      }))
    }
    setGenerationError(null)
    pendingGenerationIdRef.current = null
  }, [])

  const finishPlanGeneration = useCallback((generationId: number, parsedPlan: ProjectPlan) => {
    if (pendingGenerationIdRef.current !== generationId) return

    if (generationIntentRef.current === 'regenerate' && activeProjectIdRef.current) {
      handlePlanGenerated(parsedPlan, activeIdeaRef.current, activeProjectIdRef.current)
      return
    }

    handlePlanGenerated(parsedPlan, activeIdeaRef.current)
  }, [handlePlanGenerated])

  const { sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat', body: { mode: 'plan' } }),
    onFinish: ({ message, isError }) => {
      const generationId = pendingGenerationIdRef.current
      if (isError || generationId === null) {
        pendingGenerationIdRef.current = null
        return
      }

      const text = message.parts
        .filter((part): part is Extract<typeof part, { type: 'text' }> => part.type === 'text')
        .map((part) => part.text)
        .join('')

      try {
        finishPlanGeneration(generationId, parsePlan(text, activeIdeaRef.current))
      } catch {
        setGenerationError('The AI returned an incomplete plan. Please try again.')
        pendingGenerationIdRef.current = null
      }
    },
    onError: (requestError) => {
      setGenerationError(isRateLimitError(requestError) ? RATE_LIMIT_MESSAGE : requestError.message || 'Unable to generate a plan right now.')
      pendingGenerationIdRef.current = null
    },
  })

  const { sendMessage: sendCriteriaMessage, status: criteriaStatus } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat', body: { mode: 'acceptance-criteria' } }),
    onFinish: ({ message, isError }) => {
      const storyId = criteriaStoryIdRef.current
      if (isError || !storyId) {
        setGeneratingCriteriaForStoryId(null)
        criteriaStoryIdRef.current = null
        return
      }

      const text = message.parts
        .filter((part): part is Extract<typeof part, { type: 'text' }> => part.type === 'text')
        .map((part) => part.text)
        .join('')

      const acceptanceCriteria = parseAcceptanceCriteria(text)
      updateActivePlan((current) => ({
        ...current,
        userStories: current.userStories.map((story) =>
          story.id === storyId ? { ...story, acceptanceCriteria } : story,
        ),
      }))

      setGeneratingCriteriaForStoryId(null)
      criteriaStoryIdRef.current = null
    },
    onError: () => {
      setGeneratingCriteriaForStoryId(null)
      criteriaStoryIdRef.current = null
    },
  })

  const startGeneration = (idea: string, intent: GenerationIntent) => {
    const generationId = ++generationCounterRef.current
    activeIdeaRef.current = idea
    generationIntentRef.current = intent
    pendingGenerationIdRef.current = generationId
    setGenerationError(null)
    sendMessage({ text: `${PLAN_PROMPT}\n${idea}` })
    return generationId
  }

  const generatePlan = (projectIdea: string) => {
    const trimmedIdea = projectIdea.trim()
    if (!trimmedIdea) return
    startGeneration(trimmedIdea, 'create')
  }

  const regeneratePlan = () => {
    if (!plan) return
    startGeneration(plan.projectIdea, 'regenerate')
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

  const deleteProject = (id: string) => {
    setProjectsState((prev) => {
      const remaining = prev.projects.filter((project) => project.id !== id)
      const wasActive = prev.activeProjectId === id
      return {
        projects: remaining,
        activeProjectId: wasActive ? remaining[0]?.id ?? null : prev.activeProjectId,
      }
    })
  }

  const suggestAcceptanceCriteria = (storyId: string, storyText: string) => {
    criteriaStoryIdRef.current = storyId
    setGeneratingCriteriaForStoryId(storyId)
    sendCriteriaMessage({ text: `${ACCEPTANCE_CRITERIA_PROMPT}\n${storyText}` })
  }

  const updateKanbanTasks = (tasks: KanbanTask[]) => {
    updateActivePlan((current) => ({ ...current, kanbanTasks: tasks }))
  }

  const updateRequirements = (requirements: RequirementSet) => {
    updateActivePlan((current) => ({ ...current, requirements }))
  }

  const updateUserStories = (userStories: UserStoryItem[]) => {
    updateActivePlan((current) => ({ ...current, userStories }))
  }

  const updateSuggestedFeatures = (suggestedFeatures: PlanItem[]) => {
    updateActivePlan((current) => ({ ...current, suggestedFeatures }))
  }

  const value = {
    plan,
    projects: projectsState.projects,
    activeProjectId: projectsState.activeProjectId,
    activeProjectTitle: activeProject?.title ?? null,
    isGenerating: status === 'submitted' || status === 'streaming',
    generatingCriteriaForStoryId,
    isGeneratingCriteria: criteriaStatus === 'submitted' || criteriaStatus === 'streaming',
    error: generationError || error?.message || null,
    generatePlan,
    regeneratePlan,
    switchProject,
    updateProjectTitle,
    deleteProject,
    suggestAcceptanceCriteria,
    updateKanbanTasks,
    updateRequirements,
    updateUserStories,
    updateSuggestedFeatures,
  }

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export type { PlanItem, UserStoryItem } from './plan-items'
