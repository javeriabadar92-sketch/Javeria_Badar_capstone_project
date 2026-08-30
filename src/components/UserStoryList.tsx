import { useState } from 'react'
import { Check, ChevronDown, ListChecks, LoaderCircle, Plus, Sparkles, Trash2, X } from 'lucide-react'
import type { UserStoryItem } from '../context/plan-items'
import { createUserStoryItem } from '../context/plan-items'
import InlineEmptyState from './InlineEmptyState'
import ReviewToggle from './ReviewToggle'
import Toast from './Toast'

type UserStoryListProps = {
  items: UserStoryItem[]
  onChange: (items: UserStoryItem[]) => void
  onSuggestCriteria: (storyId: string, storyText: string) => void
  generatingCriteriaForStoryId: string | null
  addLabel?: string
}

function UserStoryCard({
  item,
  index,
  isExiting,
  isEntering,
  isExpanded,
  isGeneratingCriteria,
  onToggleExpand,
  onSave,
  onDelete,
  onReviewChange,
  onSuggestCriteria,
}: {
  item: UserStoryItem
  index: number
  isExiting: boolean
  isEntering: boolean
  isExpanded: boolean
  isGeneratingCriteria: boolean
  onToggleExpand: () => void
  onSave: (text: string) => void
  onDelete: () => void
  onReviewChange: (reviewed: boolean) => void
  onSuggestCriteria: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.text)

  const motionClass = `list-item-motion ${isEntering ? 'list-item-enter' : ''} ${isExiting ? 'list-item-exit' : ''}`
  const reviewedClass = item.reviewed ? 'opacity-75' : ''

  const startEdit = () => {
    setDraft(item.text)
    setEditing(true)
  }

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed) onSave(trimmed)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(item.text)
    setEditing(false)
  }

  return (
    <article className={`surface-card group p-5 ${motionClass} ${reviewedClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <ReviewToggle reviewed={item.reviewed} onChange={onReviewChange} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-800">
            Story {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <button type="button" onClick={onDelete} aria-label="Delete story" className="focus-ring rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600">
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {editing ? (
        <div className="mt-3 flex items-start gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            className="focus-ring min-w-0 flex-1 resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save() }
              if (e.key === 'Escape') cancel()
            }}
          />
          <div className="flex shrink-0 gap-1">
            <button type="button" onClick={save} aria-label="Save edit" className="focus-ring rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100">
              <Check className="size-4" />
            </button>
            <button type="button" onClick={cancel} aria-label="Cancel edit" className="focus-ring rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50">
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={startEdit}
          className={`focus-ring mt-3 w-full text-left text-[15px] leading-7 hover:text-slate-900 ${item.reviewed ? 'text-slate-500 line-through decoration-emerald-300' : 'text-slate-700'}`}
        >
          {item.text}
        </button>
      )}

      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        className="focus-ring mt-4 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:border-cyan-800 hover:bg-cyan-50/40"
      >
        <span>{isExpanded ? 'Hide details' : 'Show details & acceptance criteria'}</span>
        <ChevronDown className={`size-4 text-cyan-800 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
          {item.acceptanceCriteria.length > 0 && (
            <ul className="space-y-2">
              {item.acceptanceCriteria.map((criterion) => (
                <li key={criterion} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-800" aria-hidden="true" />
                  {criterion}
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={onSuggestCriteria}
            disabled={isGeneratingCriteria}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-cyan-800 bg-white px-3 py-2 text-sm font-medium text-cyan-800 transition-colors hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGeneratingCriteria ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                Generating criteria...
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden="true" />
                Suggest acceptance criteria
              </>
            )}
          </button>
        </div>
      )}
    </article>
  )
}

export default function UserStoryList({
  items,
  onChange,
  onSuggestCriteria,
  generatingCriteriaForStoryId,
  addLabel = '+ Add story',
}: UserStoryListProps) {
  const [exitingIds, setExitingIds] = useState<string[]>([])
  const [enteringIds, setEnteringIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const updateItem = (id: string, updater: (item: UserStoryItem) => UserStoryItem) => {
    onChange(items.map((item) => (item.id === id ? updater(item) : item)))
  }

  const deleteItem = (id: string) => {
    setExitingIds((current) => [...current, id])
    setExpandedIds((current) => current.filter((itemId) => itemId !== id))
    window.setTimeout(() => {
      onChange(items.filter((item) => item.id !== id))
      setExitingIds((current) => current.filter((itemId) => itemId !== id))
    }, 200)
  }

  const addItem = () => {
    const newItem = createUserStoryItem('New user story')
    onChange([...items, newItem])
    setEnteringIds((current) => [...current, newItem.id])
    window.setTimeout(() => {
      setEnteringIds((current) => current.filter((itemId) => itemId !== newItem.id))
    }, 220)
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    )
  }

  const handleReviewChange = (id: string, reviewed: boolean) => {
    updateItem(id, (current) => ({ ...current, reviewed }))
    if (reviewed) {
      setToastMessage('Nice! Marked as done 🎉')
    }
  }

  const activeItems = items.filter((item) => !item.reviewed)
  const doneItems = items.filter((item) => item.reviewed)

  const renderCard = (item: UserStoryItem, index: number) => (
    <UserStoryCard
      key={item.id}
      item={item}
      index={index}
      isExiting={exitingIds.includes(item.id)}
      isEntering={enteringIds.includes(item.id)}
      isExpanded={expandedIds.includes(item.id)}
      isGeneratingCriteria={generatingCriteriaForStoryId === item.id}
      onToggleExpand={() => toggleExpanded(item.id)}
      onSave={(text) => updateItem(item.id, (current) => ({ ...current, text }))}
      onDelete={() => deleteItem(item.id)}
      onReviewChange={(reviewed) => handleReviewChange(item.id, reviewed)}
      onSuggestCriteria={() => onSuggestCriteria(item.id, item.text)}
    />
  )

  return (
    <div>
      {items.length === 0 ? (
        <InlineEmptyState
          icon={ListChecks}
          title="No user stories yet — add one below"
          description="Use the button below to add your first story."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {activeItems.map((item, index) => renderCard(item, index))}
        </div>
      )}

      <button type="button" onClick={addItem} className="focus-ring add-button mt-4">
        <Plus className="size-4" /> {addLabel}
      </button>

      {doneItems.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Done ({doneItems.length})
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {doneItems.map((item, index) => renderCard(item, index))}
          </div>
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
    </div>
  )
}