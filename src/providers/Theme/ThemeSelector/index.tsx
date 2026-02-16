'use client'

import React, { useState } from 'react'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState<'light' | 'dark'>('dark')

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (preference === 'light' || preference === 'dark') {
      setValue(preference)
      return
    }

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setValue(systemDark ? 'dark' : 'light')
  }, [])

  const isDark = value === 'dark'

  const toggleTheme = () => {
    const next: 'light' | 'dark' = isDark ? 'light' : 'dark'
    setTheme(next)
    setValue(next)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode sombre' : 'Mode clair'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-base transition hover:border-[#d4af37]/45 hover:bg-white/10"
    >
      <span aria-hidden>{isDark ? '🌙' : '☀️'}</span>
    </button>
  )
}
