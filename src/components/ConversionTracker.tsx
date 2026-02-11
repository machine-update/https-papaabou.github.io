'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

const STORAGE_KEY = 'xksprod_conversion_events'

export const ConversionTracker = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const tracked = target?.closest<HTMLElement>('[data-track-event]')

      if (!tracked) {
        return
      }

      const payload = {
        event: tracked.dataset.trackEvent || 'cta_click',
        cta_location: tracked.dataset.trackLocation || 'unknown',
        cta_label: tracked.dataset.trackLabel || tracked.textContent?.trim() || 'unknown',
        href: tracked.getAttribute('href') || '',
        ts: new Date().toISOString(),
      }

      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(payload)

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const events = raw ? (JSON.parse(raw) as typeof window.dataLayer) : []
        events.push(payload)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-100)))
      } catch {
        // Ignore storage failures and keep tracking in dataLayer.
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
