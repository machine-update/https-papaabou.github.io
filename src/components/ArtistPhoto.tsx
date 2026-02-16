'use client'

import Image from 'next/image'
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
    <Image
      src={src}
      alt={alt}
      width={800}
      height={1000}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
