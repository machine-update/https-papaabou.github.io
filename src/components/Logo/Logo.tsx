'use client'

import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className, loading = 'lazy', priority = 'low' } = props
  const [hasError, setHasError] = React.useState(false)

  if (hasError) {
    return (
      <span className={clsx('text-sm tracking-[0.2em] uppercase text-xks-gold font-semibold', className)}>
        XKSGROUP
      </span>
    )
  }

  return (
    <>
      <Image
        src="/xksprod.webp"
        alt="XKSGROUP Company"
        width={220}
        height={70}
        loading={loading}
        fetchPriority={priority}
        sizes="(max-width: 768px) 8.8rem, 11rem"
        className={clsx('h-auto w-[8.8rem] md:w-[11rem] object-contain', className)}
        onError={() => setHasError(true)}
      />
      <span className="sr-only">XKSGROUP Company</span>
    </>
  )
}
