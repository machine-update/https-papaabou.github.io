'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const PERIODS = [7, 30, 90] as const

export function DashboardFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const period = Number(searchParams.get('period') || 30)
  const q = searchParams.get('q') || ''

  function updateParams(next: { period?: number; q?: string }) {
    const params = new URLSearchParams(searchParams.toString())
    if (typeof next.period === 'number') params.set('period', String(next.period))
    if (typeof next.q === 'string') {
      const value = next.q.trim()
      if (value) params.set('q', value)
      else params.delete('q')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        defaultValue={q}
        placeholder="Recherche globale (production, artiste, partenaire, tag...)"
        className="admin-input min-w-[280px]"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            updateParams({ q: (event.currentTarget as HTMLInputElement).value })
          }
        }}
      />
      <div className="inline-flex rounded-xl border border-white/15 bg-black/30 p-1">
        {PERIODS.map((value) => {
          const active = period === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => updateParams({ period: value })}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                active ? 'bg-[#f19b32] text-black' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              {value}j
            </button>
          )
        })}
      </div>
    </div>
  )
}
