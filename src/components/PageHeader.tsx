import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  icon: LucideIcon
  title: ReactNode
  subtitle?: string
}

export default function PageHeader({ eyebrow, icon: Icon, title, subtitle }: PageHeaderProps) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-2 flex items-center gap-3">
        <Icon className="size-7 shrink-0 text-cyan-800" aria-hidden="true" />
        <h1 className="page-title mt-0">{title}</h1>
      </div>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </>
  )
}
