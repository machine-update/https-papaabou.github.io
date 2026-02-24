'use client'

type Item = { label: string; value: number }

type Props = {
  title: string
  subtitle?: string
  data: Item[]
}

const colors = ['#f19b32', '#c17d25', '#8b5e21', '#5e3f17', '#d9a55a']

export function DonutChart({ title, subtitle, data }: Props) {
  const total = data.reduce((acc, item) => acc + item.value, 0)
  const normalized = total === 0 ? data.map((item) => ({ ...item, pct: 0 })) : data.map((item) => ({ ...item, pct: item.value / total }))

  let cumulative = 0
  const radius = 44
  const circumference = 2 * Math.PI * radius

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">{title}</p>
      {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}

      <div className="mt-4 flex items-center gap-6">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="14" fill="none" />
            {normalized.map((item, index) => {
              const length = item.pct * circumference
              const dash = `${length} ${circumference - length}`
              const offset = -cumulative * circumference
              cumulative += item.pct
              return (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={colors[index % colors.length]}
                  strokeWidth="14"
                  strokeDasharray={dash}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  fill="none"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <p className="text-2xl font-semibold text-white">{total}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">Total</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-sm">
          {normalized.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="text-white/75">{item.label}</span>
              </div>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
