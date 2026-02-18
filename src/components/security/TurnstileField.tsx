'use client'

import React from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        },
      ) => string
    }
  }
}

const SCRIPT_ID = 'cloudflare-turnstile-script'

type TurnstileFieldProps = {
  onTokenChange: (token: string) => void
  theme?: 'light' | 'dark' | 'auto'
}

export const TurnstileField: React.FC<TurnstileFieldProps> = ({ onTokenChange, theme = 'dark' }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const onTokenChangeRef = React.useRef(onTokenChange)
  const [ready, setReady] = React.useState(false)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  React.useEffect(() => {
    onTokenChangeRef.current = onTokenChange
  }, [onTokenChange])

  React.useEffect(() => {
    onTokenChangeRef.current('')
  }, [])

  React.useEffect(() => {
    if (!siteKey) return

    if (window.turnstile) {
      setReady(true)
      return
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      const handleLoad = () => setReady(true)
      existing.addEventListener('load', handleLoad)
      return () => existing.removeEventListener('load', handleLoad)
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => setReady(true)
    document.head.appendChild(script)
  }, [siteKey])

  React.useEffect(() => {
    if (!siteKey || !ready || !containerRef.current || !window.turnstile) return

    containerRef.current.innerHTML = ''
    window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      callback: (token: string) => onTokenChangeRef.current(token),
      'expired-callback': () => onTokenChangeRef.current(''),
      'error-callback': () => onTokenChangeRef.current(''),
    })
  }, [ready, siteKey, theme])

  if (!siteKey) {
    return null
  }

  return <div className="relative z-10"><div ref={containerRef} /></div>
}
