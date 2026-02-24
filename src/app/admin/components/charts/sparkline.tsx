'use client'

type Point = { label: string; value: number }

export function Sparkline({
  data,
  positive = true,
}: {
  data: Point[]
  positive?: boolean
}) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100
      const y = 100 - (item.value / max) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="h-12 w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? '#39c982' : '#ef6464'}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
