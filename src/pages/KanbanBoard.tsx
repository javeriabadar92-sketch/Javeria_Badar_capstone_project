import { ArrowLeft, ArrowRight, KanbanSquare } from 'lucide-react'
import PlanEmptyState from '../components/PlanEmptyState'
import { type KanbanStatus } from '../context/PlanContext'
import { usePlan } from '../context/usePlan'

export default function KanbanBoard() {
  const { plan, updateKanbanTasks } = usePlan()
  if (!plan) return <PlanEmptyState title="Execute" icon={KanbanSquare} />

  const columns: { status: KanbanStatus; title: string }[] = [
    { status: 'todo', title: 'To Do' },
    { status: 'inProgress', title: 'In Progress' },
    { status: 'done', title: 'Done' },
  ]

  const totalTasks = plan.kanbanTasks.length
  const doneTasks = plan.kanbanTasks.filter((task) => task.status === 'done').length
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const moveTask = (title: string, direction: -1 | 1) => {
    const task = plan.kanbanTasks.find((item) => item.title === title)
    if (!task) return
    const currentIndex = columns.findIndex((column) => column.status === task.status)
    const nextColumn = columns[currentIndex + direction]
    if (!nextColumn) return
    updateKanbanTasks(plan.kanbanTasks.map((item) => item.title === title ? { ...item, status: nextColumn.status } : item))
  }

  return (
    <section className="page-shell">
      <p className="eyebrow">Execute</p>
      <h1 className="page-title">Kanban Task Board</h1>
      <p className="page-subtitle">Move tasks through the delivery flow as your project takes shape.</p>

      <div className="surface-card mt-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Overall progress</p>
            <p className="mt-1 text-xs text-slate-500">{doneTasks} of {totalTasks} tasks completed</p>
          </div>
          <span className="text-2xl font-semibold text-[#818CF8]">{progressPercent}%</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Task completion progress"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <div key={column.status} className="surface-card min-w-0 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-[#818CF8]">{column.title}</h2>
              <span className="rounded-full border border-[#334155] bg-[#0F172A] px-2 py-1 text-xs text-[#818CF8]">{plan.kanbanTasks.filter((task) => task.status === column.status).length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {plan.kanbanTasks.filter((task) => task.status === column.status).map((task) => {
                const taskIndex = columns.findIndex((item) => item.status === task.status)
                return (
                  <article key={task.title} className="surface-card p-4">
                    <p className="text-sm leading-6 text-[#E2E8F0]">{task.title}</p>
                    <div className="mt-4 flex justify-end gap-2">
                      {taskIndex > 0 && <button type="button" onClick={() => moveTask(task.title, -1)} aria-label={`Move ${task.title} left`} className="focus-ring rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"><ArrowLeft className="size-4" aria-hidden="true" /></button>}
                      {taskIndex < columns.length - 1 && <button type="button" onClick={() => moveTask(task.title, 1)} aria-label={`Move ${task.title} right`} className="focus-ring rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"><ArrowRight className="size-4" aria-hidden="true" /></button>}
                    </div>
                  </article>
                )
              })}
              {plan.kanbanTasks.every((task) => task.status !== column.status) && <p className="rounded-lg border border-dashed border-white/10 px-3 py-6 text-center text-sm text-slate-500">No tasks here yet</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
