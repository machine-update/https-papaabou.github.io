'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type LoginFormProps = {
  nextPath: string
  forbidden: boolean
}

export function LoginForm({ nextPath, forbidden }: LoginFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    forbidden ? 'Accès réservé aux administrateurs.' : null,
  )

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Login failed' }))
        throw new Error(payload.error || 'Login failed')
      }

      router.push(nextPath)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/60" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 outline-none transition focus:border-[#f19b32]/60"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/60" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 outline-none transition focus:border-[#f19b32]/60"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-[#f19b32] font-medium text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}
