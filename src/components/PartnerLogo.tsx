'use client'

import Image from 'next/image'
import React from 'react'

type Props = {
  alt: string
  mark: string
  src?: string
  href?: string
}

export const PartnerLogo: React.FC<Props> = ({ alt, mark, src, href }) => {
  const [broken, setBroken] = React.useState(false)

  const content = !src || broken ? (
    <div className="partner-mark">{mark}</div>
  ) : (
    <div className="partner-logo-wrap">
      <Image
        src={src}
        alt={alt}
        width={320}
        height={120}
        sizes="(max-width: 768px) 50vw, 20vw"
        className="partner-logo-img"
        onError={() => setBroken(true)}
      />
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="partner-card">
        {content}
      </a>
    )
  }

  return content
}
