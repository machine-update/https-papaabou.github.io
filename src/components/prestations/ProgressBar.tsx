'use client'

import React from 'react'

type ProgressBarProps = {
  label: string
  percent: number
  delayMs?: number
}

/* Animated expertise bar used to communicate operational maturity and trust signals. */
export function ProgressBar({ label, percent, delayMs = 0 }: ProgressBarProps) {
  const [active, setActive] = React.useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid gap-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="uppercase tracking-[0.14em] text-white/82">{label}</span>
        <span className="text-[#c08f3c]">{percent}%</span>
      </div>
      <div className="h-2 rounded-full border border-white/12 bg-white/5 p-[2px]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8a611f] via-[#c08f3c] to-[#f2bf6b] transition-[width] duration-1000 ease-out"
          style={{ width: active ? `${percent}%` : '0%', transitionDelay: `${delayMs}ms` }}
          aria-hidden
        />
      </div>
    </div>
  )
}
