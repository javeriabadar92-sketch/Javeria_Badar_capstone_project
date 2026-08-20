export type Priority = 'high' | 'medium' | 'low'

export type PlanItem = {
  id: string
  text: string
  priority: Priority
  reviewed: boolean
}

export type UserStoryItem = PlanItem & {
  acceptanceCriteria: string[]
}

export function createPlanItem(text: string, priority: Priority = 'medium'): PlanItem {
  return {
    id: crypto.randomUUID(),
    text,
    priority,
    reviewed: false,
  }
}

export function createUserStoryItem(text: string, priority: Priority = 'medium'): UserStoryItem {
  return {
    ...createPlanItem(text, priority),
    acceptanceCriteria: [],
  }
}

export function cyclePriority(priority: Priority): Priority {
  if (priority === 'high') return 'medium'
  if (priority === 'medium') return 'low'
  return 'high'
}

function isPriority(value: unknown): value is Priority {
  return value === 'high' || value === 'medium' || value === 'low'
}

function normalizePlanItem(value: unknown): PlanItem | null {
  if (typeof value === 'string' && value.trim()) {
    return createPlanItem(value.trim())
  }
  if (!value || typeof value !== 'object') return null
  const item = value as Record<string, unknown>
  if (typeof item.text !== 'string' || !item.text.trim()) return null
  return {
    id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
    text: item.text.trim(),
    priority: isPriority(item.priority) ? item.priority : 'medium',
    reviewed: Boolean(item.reviewed),
  }
}

export function normalizePlanItems(value: unknown): PlanItem[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const normalized = normalizePlanItem(item)
    return normalized ? [normalized] : []
  })
}

export function normalizeUserStoryItems(value: unknown): UserStoryItem[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item === 'string' && item.trim()) {
      return [createUserStoryItem(item.trim())]
    }
    const base = normalizePlanItem(item)
    if (!base) return []
    const story = item as Record<string, unknown>
    const acceptanceCriteria = Array.isArray(story.acceptanceCriteria)
      ? story.acceptanceCriteria.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
      : []
    return [{ ...base, acceptanceCriteria }]
  })
}

export function parseAcceptanceCriteria(text: string): string[] {
  const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>
    if (Array.isArray(parsed.acceptanceCriteria)) {
      return parsed.acceptanceCriteria.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    }
  } catch {
    return text
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.)]+\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 4)
  }
  return []
}
