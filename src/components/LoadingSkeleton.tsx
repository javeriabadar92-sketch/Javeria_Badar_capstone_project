type LoadingSkeletonProps = {
  rows?: number
  className?: string
}

export default function LoadingSkeleton({ rows = 4, className = '' }: LoadingSkeletonProps) {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/5', 'w-2/3']

  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={`h-3 animate-pulse rounded bg-slate-200 ${widths[index % widths.length]}`} />
      ))}
    </div>
  )
}
