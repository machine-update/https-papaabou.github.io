import React from 'react'
import { BadgeCheck } from 'lucide-react'

import { Reveal } from './Reveal'

type CardServiceProps = {
  id: string
  title: string
  description: string
  tags: string[]
  icon: React.ReactNode
  delayMs?: number
}

/* Service card component with icon, value proposition and perimeter tags. */
export function CardService({ id, title, description, tags, icon, delayMs = 0 }: CardServiceProps) {
  return (
    <Reveal delayMs={delayMs}>
      <article
        id={id}
        className="prest-card group scroll-mt-32"
        aria-labelledby={`${id}-title`}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="prest-icon" aria-hidden>
            {icon}
          </span>
          <BadgeCheck className="h-4 w-4 text-[#c08f3c]/85" aria-hidden />
        </div>

        <h2 id={`${id}-title`} className="mt-5 text-[1.2rem] leading-tight text-white md:text-2xl">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/72 md:text-[0.96rem]">{description}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Périmètre ${title}`}>
          {tags.map((tag) => (
            <li key={tag} className="prest-tag">
              {tag}
            </li>
          ))}
        </ul>

        <div className="prest-card-glow" aria-hidden />
      </article>
    </Reveal>
  )
}
