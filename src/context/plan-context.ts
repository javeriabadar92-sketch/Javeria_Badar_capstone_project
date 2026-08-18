import { createContext } from 'react'
import type { KanbanTask, ProjectPlan, RequirementSet, SavedProject } from './PlanContext'

export type PlanContextValue = {
  plan: ProjectPlan | null
  projects: SavedProject[]
  activeProjectId: string | null
  activeProjectTitle: string | null
  isGenerating: boolean
  error: string | null
  generatePlan: (projectIdea: string) => void
  regeneratePlan: () => void
  switchProject: (id: string) => void
  updateProjectTitle: (id: string, title: string) => void
  updateKanbanTasks: (tasks: KanbanTask[]) => void
  updateRequirements: (requirements: RequirementSet) => void
  updateUserStories: (userStories: string[]) => void
  updateSuggestedFeatures: (suggestedFeatures: string[]) => void
}

export const PlanContext = createContext<PlanContextValue | null>(null)
