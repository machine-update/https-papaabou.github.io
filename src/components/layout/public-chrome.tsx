'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { StickyContactCTA } from '@/components/StickyContactCTA'

const hiddenPrefixes = ['/admin', '/login', '/payload-admin']

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hidePublicChrome = hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (hidePublicChrome) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <StickyContactCTA />
    </>
  )
}
