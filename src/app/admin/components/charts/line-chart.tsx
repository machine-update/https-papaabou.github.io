'use client'

type Item = { label: string; value: number }

type Props = {
  title: string
  subtitle?: string
  data: Item[]
}

export function LineChart({ title, subtitle, data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100
      const y = 100 - (item.value / max) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">{title}</p>
      {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}

      <div className="mt-4 h-48 w-full">
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke="#f19b32" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          {data.map((item, index) => {
            const x = (index / Math.max(data.length - 1, 1)) * 100
            const y = 100 - (item.value / max) * 100
            return <circle key={`${item.label}-${index}`} cx={x} cy={y} r="1.8" fill="#f19b32" />
          })}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/65 md:grid-cols-6">
        {data.map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-center">
            <p className="truncate">{item.label}</p>
            <p className="mt-1 font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
