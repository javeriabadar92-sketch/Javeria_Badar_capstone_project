import { useState } from 'react'
import { Check, Plus, Trash2, X } from 'lucide-react'

type EditableListProps = {
  items: string[]
  onChange: (items: string[]) => void
  variant?: 'bullet' | 'card' | 'feature'
  addLabel?: string
}

function EditableListItem({
  value,
  onSave,
  onDelete,
  variant,
  index,
}: {
  value: string
  onSave: (value: string) => void
  onDelete: () => void
  variant: 'bullet' | 'card' | 'feature'
  index: number
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

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
      <div className="flex items-start gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={variant === 'card' || variant === 'feature' ? 3 : 2}
          autoFocus
          className="focus-ring min-w-0 flex-1 resize-y rounded-lg border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-slate-100"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save() }
            if (e.key === 'Escape') cancel()
          }}
        />
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={save} aria-label="Save edit" className="focus-ring rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-2 text-emerald-300 hover:bg-emerald-400/20">
            <Check className="size-4" />
          </button>
          <button type="button" onClick={cancel} aria-label="Cancel edit" className="focus-ring rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <article className="surface-card group p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Story {String(index + 1).padStart(2, '0')}</span>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:bg-red-950/40 hover:text-red-300">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
        <button type="button" onClick={startEdit} className="focus-ring mt-3 w-full text-left text-[15px] leading-7 text-[#E2E8F0] hover:text-white">
          {value}
        </button>
      </article>
    )
  }

  if (variant === 'feature') {
    return (
      <article className="surface-card group p-5 transition-colors hover:border-[#818CF8]/50">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#818CF8]">{String(index + 1).padStart(2, '0')}</span>
          <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-950/40 hover:text-red-300">
            <Trash2 className="size-3.5" />
          </button>
        </div>
        <button type="button" onClick={startEdit} className="focus-ring mt-5 w-full text-left text-[15px] font-medium leading-7 text-[#E2E8F0] hover:text-white">
          {value}
        </button>
      </article>
    )
  }

  return (
    <li className="group flex items-start gap-2">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#818CF8]" aria-hidden="true" />
      <button type="button" onClick={startEdit} className="focus-ring min-w-0 flex-1 text-left text-sm leading-6 text-[#E2E8F0] hover:text-white">
        {value}
      </button>
      <button type="button" onClick={onDelete} aria-label="Delete item" className="focus-ring shrink-0 rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-950/40 hover:text-red-300">
        <Trash2 className="size-3.5" />
      </button>
    </li>
  )
}

export default function EditableList({ items, onChange, variant = 'bullet', addLabel = '+ Add' }: EditableListProps) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }

  const deleteItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, 'New item'])
  }

  if (variant === 'bullet') {
    return (
      <div>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <EditableListItem key={`${index}-${item}`} value={item} index={index} variant={variant} onSave={(v) => updateItem(index, v)} onDelete={() => deleteItem(index)} />
          ))}
        </ul>
        <button type="button" onClick={addItem} className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-white/15 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-primary/40 hover:text-primary">
          <Plus className="size-4" /> {addLabel}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className={variant === 'feature' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-4 md:grid-cols-2'}>
        {items.map((item, index) => (
          <EditableListItem key={`${index}-${item}`} value={item} index={index} variant={variant} onSave={(v) => updateItem(index, v)} onDelete={() => deleteItem(index)} />
        ))}
      </div>
      <button type="button" onClick={addItem} className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-white/15 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-primary/40 hover:text-primary">
        <Plus className="size-4" /> {addLabel}
      </button>
    </div>
  )
}
