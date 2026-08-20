import { useState } from 'react'
import { Check, ClipboardList, Plus, Sparkles, Trash2, X } from 'lucide-react'
import type { PlanItem } from '../context/plan-items'
import { createPlanItem } from '../context/plan-items'
import InlineEmptyState from './InlineEmptyState'
import PriorityTag from './PriorityTag'
import ReviewToggle from './ReviewToggle'

type EditableListProps = {
  items: PlanItem[]
  onChange: (items: PlanItem[]) => void
  variant?: 'bullet' | 'feature'
  addLabel?: string
  emptyTitle?: string
  emptyDescription?: string
}

function EditableListItem({
  item,
  onSave,
  onDelete,
  onPriorityChange,
  onReviewChange,
  variant,
  index,
  isExiting,
  isEntering,
}: {
  item: PlanItem
  onSave: (value: string) => void
  onDelete: () => void
  onPriorityChange: (priority: PlanItem['priority']) => void
  onReviewChange: (reviewed: boolean) => void
  variant: 'bullet' | 'feature'
  index: number
  isExiting: boolean
  isEntering: boolean
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

  if (editing) {
    return (
      <div className={`flex items-start gap-2 ${motionClass}`}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={variant === 'feature' ? 3 : 2}
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
    )
  }

  if (variant === 'feature') {
    return (
      <article className={`surface-card group p-5 ${motionClass} ${reviewedClass}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <ReviewToggle reviewed={item.reviewed} onChange={onReviewChange} />
            <span className="text-xs font-semibold text-cyan-600">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-1">
            <PriorityTag priority={item.priority} onChange={onPriorityChange} />
            <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
        <button type="button" onClick={startEdit} className={`focus-ring mt-4 w-full text-left text-[15px] font-medium leading-7 hover:text-slate-900 ${item.reviewed ? 'text-slate-500 line-through decoration-emerald-300' : 'text-slate-700'}`}>
          {item.text}
        </button>
      </article>
    )
  }

  return (
    <li className={`group flex items-start gap-2 ${motionClass} ${reviewedClass}`}>
      <ReviewToggle reviewed={item.reviewed} onChange={onReviewChange} />
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <button type="button" onClick={startEdit} className={`focus-ring w-full text-left text-sm leading-6 hover:text-slate-900 ${item.reviewed ? 'text-slate-500 line-through decoration-emerald-300' : 'text-slate-700'}`}>
          {item.text}
        </button>
      </div>
      <PriorityTag priority={item.priority} onChange={onPriorityChange} />
      <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring shrink-0 rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600">
        <Trash2 className="size-3.5" />
      </button>
    </li>
  )
}

export default function EditableList({
  items,
  onChange,
  variant = 'bullet',
  addLabel = '+ Add',
  emptyTitle,
  emptyDescription,
}: EditableListProps) {
  const [exitingIds, setExitingIds] = useState<string[]>([])
  const [enteringIds, setEnteringIds] = useState<string[]>([])

  const updateItem = (id: string, updater: (item: PlanItem) => PlanItem) => {
    onChange(items.map((item) => (item.id === id ? updater(item) : item)))
  }

  const deleteItem = (id: string) => {
    setExitingIds((current) => [...current, id])
    window.setTimeout(() => {
      onChange(items.filter((item) => item.id !== id))
      setExitingIds((current) => current.filter((itemId) => itemId !== id))
    }, 200)
  }

  const addItem = () => {
    const newItem = createPlanItem('New item')
    onChange([...items, newItem])
    setEnteringIds((current) => [...current, newItem.id])
    window.setTimeout(() => {
      setEnteringIds((current) => current.filter((itemId) => itemId !== newItem.id))
    }, 220)
  }

  const EmptyIcon = variant === 'feature' ? Sparkles : ClipboardList
  const defaultEmptyTitle = variant === 'feature'
    ? 'No features yet — add one below'
    : 'No requirements yet — add one below'

  const emptyState = items.length === 0 ? (
    <InlineEmptyState
      icon={EmptyIcon}
      title={emptyTitle ?? defaultEmptyTitle}
      description={emptyDescription ?? 'Use the button below to add your first item.'}
    />
  ) : null

  const listItems = items.map((item, index) => (
    <EditableListItem
      key={item.id}
      item={item}
      index={index}
      variant={variant}
      isExiting={exitingIds.includes(item.id)}
      isEntering={enteringIds.includes(item.id)}
      onSave={(text) => updateItem(item.id, (current) => ({ ...current, text }))}
      onDelete={() => deleteItem(item.id)}
      onPriorityChange={(priority) => updateItem(item.id, (current) => ({ ...current, priority }))}
      onReviewChange={(reviewed) => updateItem(item.id, (current) => ({ ...current, reviewed }))}
    />
  ))

  if (variant === 'bullet') {
    return (
      <div>
        {emptyState}
        <ul className="space-y-3">{listItems}</ul>
        <button type="button" onClick={addItem} className="focus-ring add-button mt-4">
          <Plus className="size-4" /> {addLabel}
        </button>
      </div>
    )
  }

  return (
    <div>
      {emptyState}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{listItems}</div>
      <button type="button" onClick={addItem} className="focus-ring add-button mt-4">
        <Plus className="size-4" /> {addLabel}
      </button>
    </div>
  )
}
