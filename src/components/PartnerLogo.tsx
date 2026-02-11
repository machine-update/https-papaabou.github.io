'use client'

import React from 'react'

type Props = {
  alt: string
  mark: string
  src?: string
}

export const PartnerLogo: React.FC<Props> = ({ alt, mark, src }) => {
  const [broken, setBroken] = React.useState(false)

  if (!src || broken) {
    return <div className="partner-mark">{mark}</div>
  }

  return (
    <div className="partner-logo-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="partner-logo-img"
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
      />
    </div>
  )
}
