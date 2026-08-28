import { useEffect } from 'react'
import { PartyPopper } from 'lucide-react'

type ToastProps = {
  message: string
  onDismiss: () => void
}

export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 1800)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg">
        <PartyPopper className="size-4 text-cyan-400" aria-hidden="true" />
        {message}
      </div>
    </div>
  )
}