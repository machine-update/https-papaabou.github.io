'use client'

type Item = { label: string; value: number }

type Props = {
  title: string
  subtitle?: string
  data: Item[]
}

export function BarChart({ title, subtitle, data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">{title}</p>
      {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}

      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-white/70">
              <span>{item.label}</span>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#f19b32]/80 to-[#f19b32]"
                style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
