import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PageHeader from '../components/PageHeader'

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
        <PageHeader
          eyebrow="Health Check"
          icon={CheckCircle2}
          title={<>API connectivity <span className="text-cyan-800">status</span></>}
        />
        <span className="rounded-full border border-cyan-800 bg-[#ECFEFF] px-3 py-1 text-sm font-medium text-cyan-800">
          Live test
        </span>
      </div>

      {loading && (
        <div className="surface-card p-5 sm:p-6">
          <LoadingSkeleton rows={5} />
        </div>
      )}

      {error && (
        <div className="surface-card border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Unable to load data.</p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {quote && !error && (
        <div className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-cyan-800">Quote #{quote.id}</h3>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
              Live quote
            </span>
          </div>
          <p className="mt-4 text-[15px] leading-7 text-slate-700">&quot;{quote.quote}&quot;</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm">
              <p className="text-sm font-medium text-slate-600">Author</p>
              <p className="mt-1 text-lg font-bold text-cyan-800">{quote.author}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm">
              <p className="text-sm font-medium text-slate-600">Quote ID</p>
              <p className="mt-1 text-lg font-bold text-cyan-800">{quote.id}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
