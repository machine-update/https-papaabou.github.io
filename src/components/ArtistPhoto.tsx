'use client'

import React from 'react'

type Props = {
  src: string
  alt: string
  fallback: string
  className?: string
}

export const ArtistPhoto: React.FC<Props> = ({ src, alt, fallback, className }) => {
  const [broken, setBroken] = React.useState(false)

  if (broken) {
    return <div className={className}>{fallback}</div>
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
