import { createContext } from 'react'
import type { KanbanTask, ProjectPlan, RequirementSet, SavedProject } from './PlanContext'
import type { PlanItem, UserStoryItem } from './plan-items'

export type PlanContextValue = {
  plan: ProjectPlan | null
  projects: SavedProject[]
  activeProjectId: string | null
  activeProjectTitle: string | null
  isGenerating: boolean
  generatingCriteriaForStoryId: string | null
  isGeneratingCriteria: boolean
  error: string | null
  generatePlan: (projectIdea: string) => void
  regeneratePlan: () => void
  switchProject: (id: string) => void
  updateProjectTitle: (id: string, title: string) => void
  deleteProject: (id: string) => void
  suggestAcceptanceCriteria: (storyId: string, storyText: string) => void
  updateKanbanTasks: (tasks: KanbanTask[]) => void
  updateRequirements: (requirements: RequirementSet) => void
  updateUserStories: (userStories: UserStoryItem[]) => void
  updateSuggestedFeatures: (suggestedFeatures: PlanItem[]) => void
}

export const PlanContext = createContext<PlanContextValue | null>(null)
