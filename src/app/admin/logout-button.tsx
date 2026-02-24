'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onLogout() {
    setLoading(true)

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left text-sm text-white/80 transition hover:border-[#f19b32]/35 hover:text-white disabled:opacity-60"
    >
      {loading ? 'Déconnexion...' : 'Déconnexion'}
    </button>
  )
}
