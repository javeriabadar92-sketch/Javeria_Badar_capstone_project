import { useState } from 'react'
import { Check, ClipboardList, ListChecks, Plus, Sparkles, Trash2, X } from 'lucide-react'
import InlineEmptyState from './InlineEmptyState'

type EditableListProps = {
  items: string[]
  onChange: (items: string[]) => void
  variant?: 'bullet' | 'card' | 'feature'
  addLabel?: string
  emptyTitle?: string
  emptyDescription?: string
}

function EditableListItem({
  value,
  onSave,
  onDelete,
  variant,
  index,
  isExiting,
  isEntering,
}: {
  value: string
  onSave: (value: string) => void
  onDelete: () => void
  variant: 'bullet' | 'card' | 'feature'
  index: number
  isExiting: boolean
  isEntering: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const motionClass = `list-item-motion ${isEntering ? 'list-item-enter' : ''} ${isExiting ? 'list-item-exit' : ''}`

  const startEdit = () => {
    setDraft(value)
    setEditing(true)
  }

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed) onSave(trimmed)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className={`flex items-start gap-2 ${motionClass}`}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={variant === 'card' || variant === 'feature' ? 3 : 2}
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

  if (variant === 'card') {
    return (
      <article className={`surface-card group p-5 ${motionClass}`}>
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Story {String(index + 1).padStart(2, '0')}</span>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
        <button type="button" onClick={startEdit} className="focus-ring mt-3 w-full text-left text-[15px] leading-7 text-slate-700 hover:text-slate-900">
          {value}
        </button>
      </article>
    )
  }

  if (variant === 'feature') {
    return (
      <article className={`surface-card group p-5 ${motionClass}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-cyan-600">{String(index + 1).padStart(2, '0')}</span>
          <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="size-3.5" />
          </button>
        </div>
        <button type="button" onClick={startEdit} className="focus-ring mt-5 w-full text-left text-[15px] font-medium leading-7 text-slate-700 hover:text-slate-900">
          {value}
        </button>
      </article>
    )
  }

  return (
    <li className={`group flex items-start gap-2 ${motionClass}`}>
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden="true" />
      <button type="button" onClick={startEdit} className="focus-ring min-w-0 flex-1 text-left text-sm leading-6 text-slate-700 hover:text-slate-900">
        {value}
      </button>
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
  const [exitingIndexes, setExitingIndexes] = useState<number[]>([])
  const [enteringIndexes, setEnteringIndexes] = useState<number[]>([])

  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }

  const deleteItem = (index: number) => {
    setExitingIndexes((current) => [...current, index])
    window.setTimeout(() => {
      onChange(items.filter((_, i) => i !== index))
      setExitingIndexes((current) => current.filter((item) => item !== index))
    }, 200)
  }

  const addItem = () => {
    const newIndex = items.length
    onChange([...items, 'New item'])
    setEnteringIndexes((current) => [...current, newIndex])
    window.setTimeout(() => {
      setEnteringIndexes((current) => current.filter((item) => item !== newIndex))
    }, 220)
  }

  const EmptyIcon = variant === 'feature' ? Sparkles : variant === 'card' ? ListChecks : ClipboardList
  const defaultEmptyTitle = variant === 'feature'
    ? 'No features yet — add one below'
    : variant === 'card'
      ? 'No user stories yet — add one below'
      : 'No requirements yet — add one below'

  const emptyState = items.length === 0 ? (
    <InlineEmptyState
      icon={EmptyIcon}
      title={emptyTitle ?? defaultEmptyTitle}
      description={emptyDescription ?? 'Use the button below to add your first item.'}
    />
  ) : null

  if (variant === 'bullet') {
    return (
      <div>
        {emptyState}
        <ul className="space-y-3">
          {items.map((item, index) => (
            <EditableListItem
              key={`${index}-${item}`}
              value={item}
              index={index}
              variant={variant}
              isExiting={exitingIndexes.includes(index)}
              isEntering={enteringIndexes.includes(index)}
              onSave={(v) => updateItem(index, v)}
              onDelete={() => deleteItem(index)}
            />
          ))}
        </ul>
        <button type="button" onClick={addItem} className="focus-ring add-button mt-4">
          <Plus className="size-4" /> {addLabel}
        </button>
      </div>
    )
  }

  return (
    <div>
      {emptyState}
      <div className={variant === 'feature' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-4 md:grid-cols-2'}>
        {items.map((item, index) => (
          <EditableListItem
            key={`${index}-${item}`}
            value={item}
            index={index}
            variant={variant}
            isExiting={exitingIndexes.includes(index)}
            isEntering={enteringIndexes.includes(index)}
            onSave={(v) => updateItem(index, v)}
            onDelete={() => deleteItem(index)}
          />
        ))}
      </div>
      <button type="button" onClick={addItem} className="focus-ring add-button mt-4">
        <Plus className="size-4" /> {addLabel}
      </button>
    </div>
  )
}
