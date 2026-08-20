export default function PlanGenerationSkeleton() {
  return (
    <div className="surface-card mt-6 space-y-4 p-5" role="status" aria-live="polite" aria-label="Generating project plan">
      <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="grid gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </div>
  )
}
