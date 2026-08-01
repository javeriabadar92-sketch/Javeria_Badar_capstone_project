import { useEffect, useState } from 'react'

type Quote = {
  id: number
  quote: string
  author: string
}

export default function HealthCheck() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random')
        if (!response.ok) {
          throw new Error('Unable to load health check data')
        }

        const data = (await response.json()) as Quote
        setQuote(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    void fetchQuote()
  }, [])

  return (
    <section className="rounded-card border border-white/10 bg-slate-800/70 p-8 text-slate-100 shadow-2xl shadow-black/20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Health Check</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#F8FAFC]">API connectivity status</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Live test
        </span>
      </div>

      {loading && <p className="text-[15px] leading-7 text-[#94A3B8]">Loading...</p>}

      {error && (
        <div className="rounded-card border border-error/30 bg-error/10 p-4 text-error">
          <p className="font-medium">Unable to load data.</p>
          <p className="mt-1 text-sm text-slate-700">{error}</p>
        </div>
      )}

      {quote && !error && (
        <div className="rounded-card border border-slate-200 bg-[#F1F5F9] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#1E293B]">Quote #{quote.id}</h3>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
              Live quote
            </span>
          </div>
          <p className="mt-4 text-[15px] leading-7 text-[#334155]">“{quote.quote}”</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card bg-[#E2E8F0] p-4">
              <p className="text-sm font-medium text-[#475569]">Author</p>
              <p className="mt-1 text-lg font-bold text-[#0F172A]">{quote.author}</p>
            </div>
            <div className="rounded-card bg-[#E2E8F0] p-4">
              <p className="text-sm font-medium text-[#475569]">Quote ID</p>
              <p className="mt-1 text-lg font-bold text-[#0F172A]">{quote.id}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
