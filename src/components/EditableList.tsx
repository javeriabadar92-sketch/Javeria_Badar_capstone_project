import { useState } from 'react'
import { Check, ClipboardList, Plus, Sparkles, Trash2, X } from 'lucide-react'
import type { PlanItem } from '../context/plan-items'
import { createPlanItem } from '../context/plan-items'
import InlineEmptyState from './InlineEmptyState'
import ReviewToggle from './ReviewToggle'
import Toast from './Toast'

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
  onReviewChange,
  variant,
  index,
  isExiting,
  isEntering,
}: {
  item: PlanItem
  onSave: (value: string) => void
  onDelete: () => void
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
            <span className="text-xs font-semibold text-cyan-800">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="size-3.5" />
          </button>
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
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-800" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <button type="button" onClick={startEdit} className={`focus-ring w-full text-left text-sm leading-6 hover:text-slate-900 ${item.reviewed ? 'text-slate-500 line-through decoration-emerald-300' : 'text-slate-700'}`}>
          {item.text}
        </button>
      </div>
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
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

  const handleReviewChange = (id: string, reviewed: boolean) => {
    updateItem(id, (current) => ({ ...current, reviewed }))
    if (reviewed) {
      setToastMessage('Nice! Marked as done 🎉')
    }
  }

  const EmptyIcon = variant === 'feature' ? Sparkles : ClipboardList
  const defaultEmptyTitle = variant === 'feature'
    ? 'No features yet — add one below'
    : 'No requirements yet — add one below'

  const activeItems = items.filter((item) => !item.reviewed)
  const doneItems = items.filter((item) => item.reviewed)

  const emptyState = items.length === 0 ? (
    <InlineEmptyState
      icon={EmptyIcon}
      title={emptyTitle ?? defaultEmptyTitle}
      description={emptyDescription ?? 'Use the button below to add your first item.'}
    />
  ) : null

  const renderItem = (item: PlanItem, index: number) => (
    <EditableListItem
      key={item.id}
      item={item}
      index={index}
      variant={variant}
      isExiting={exitingIds.includes(item.id)}
      isEntering={enteringIds.includes(item.id)}
      onSave={(text) => updateItem(item.id, (current) => ({ ...current, text }))}
      onDelete={() => deleteItem(item.id)}
      onReviewChange={(reviewed) => handleReviewChange(item.id, reviewed)}
    />
  )

  const activeList = activeItems.map((item, index) => renderItem(item, index))
  const doneList = doneItems.map((item, index) => renderItem(item, index))

  const wrapperClass = variant === 'bullet' ? 'space-y-3' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
  const Wrapper = variant === 'bullet' ? 'ul' : 'div'

  return (
    <div>
      {emptyState}

      {activeItems.length > 0 && <Wrapper className={wrapperClass}>{activeList}</Wrapper>}

      <button type="button" onClick={addItem} className="focus-ring add-button mt-4">
        <Plus className="size-4" /> {addLabel}
      </button>

      {doneItems.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Done ({doneItems.length})
          </p>
          <Wrapper className={wrapperClass}>{doneList}</Wrapper>
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
    </div>
  )
}