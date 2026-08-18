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
    <section className="page-shell">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Health Check</p>
          <h2 className="page-title">API connectivity status</h2>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Live test
        </span>
      </div>

      {loading && <p className="page-subtitle">Loading...</p>}

      {error && (
        <div className="surface-card border-red-400/30 bg-red-950/30 p-4 text-red-200">
          <p className="font-medium">Unable to load data.</p>
          <p className="mt-1 text-sm text-red-200/80">{error}</p>
        </div>
      )}

      {quote && !error && (
        <div className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#818CF8]">Quote #{quote.id}</h3>
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200">
              Live quote
            </span>
          </div>
          <p className="mt-4 text-[15px] leading-7 text-slate-300">&quot;{quote.quote}&quot;</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#334155] bg-[#1E293B] p-4">
              <p className="text-sm font-medium text-slate-400">Author</p>
              <p className="mt-1 text-lg font-bold text-[#818CF8]">{quote.author}</p>
            </div>
            <div className="rounded-lg border border-[#334155] bg-[#1E293B] p-4">
              <p className="text-sm font-medium text-slate-400">Quote ID</p>
              <p className="mt-1 text-lg font-bold text-[#818CF8]">{quote.id}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
