'use client'

import React from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { TurnstileField } from '@/components/security/TurnstileField'

type CastingState = {
  fullName: string
  firstName: string
  email: string
  phone: string
  city: string
  talentType: string
  videoLink: string
  message: string
  website: string
  consent: boolean
  turnstileToken: string
}

const initialState: CastingState = {
  fullName: '',
  firstName: '',
  email: '',
  phone: '',
  city: '',
  talentType: '',
  videoLink: '',
  message: '',
  website: '',
  consent: false,
  turnstileToken: '',
}

export function CastingForm() {
  const captchaEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  const [form, setForm] = React.useState<CastingState>(initialState)
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const onChange =
    (key: keyof CastingState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = key === 'consent' ? (event.target as HTMLInputElement).checked : event.target.value
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] || null
    setFile(nextFile)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.fullName || !form.firstName || !form.email || !form.videoLink || !form.consent) {
      setError('Merci de remplir tous les champs obligatoires.')
      return
    }

    if (captchaEnabled && !form.turnstileToken) {
      setError('Merci de valider la vérification anti-bot.')
      return
    }

    const payload = new FormData()
    payload.append('fullName', form.fullName)
    payload.append('firstName', form.firstName)
    payload.append('email', form.email)
    payload.append('phone', form.phone)
    payload.append('city', form.city)
    payload.append('talentType', form.talentType)
    payload.append('videoLink', form.videoLink)
    payload.append('message', form.message)
    payload.append('website', form.website)
    payload.append('consent', String(form.consent))
    payload.append('turnstileToken', form.turnstileToken)

    if (file) {
      payload.append('attachment', file)
    }

    setLoading(true)
    try {
      const response = await fetch('/api/casting', {
        method: 'POST',
        body: payload,
      })

      const json = (await response.json()) as { ok: boolean; error?: string; message?: string }

      if (!response.ok || !json.ok) {
        setError(json.error || 'Impossible d’envoyer la candidature.')
        setLoading(false)
        return
      }

      setSuccess(json.message || 'Candidature envoyée.')
      setForm(initialState)
      setFile(null)
    } catch {
      setError('Erreur réseau. Merci de réessayer dans quelques minutes.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="casting-form-panel p-6 md:p-8 grid gap-5 relative overflow-hidden">
      <div className="absolute inset-0 cta-panel-noise pointer-events-none" />
      <div className="absolute -top-16 -right-10 w-56 h-56 cta-orb pointer-events-none" />

      <div className="grid gap-2 relative z-10">
        <span className="eyebrow">Formulaire</span>
        <h2 className="text-2xl md:text-3xl tracking-tight">Inscris-toi et tente ta chance</h2>
        <p className="text-white/70">Les champs marqués d’un * sont obligatoires.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 relative z-10">
        <label className="grid gap-2">
          <span className="contact-label">Votre nom *</span>
          <input className="contact-input" value={form.fullName} onChange={onChange('fullName')} required />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Votre prénom *</span>
          <input className="contact-input" value={form.firstName} onChange={onChange('firstName')} required />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Votre email *</span>
          <input className="contact-input" type="email" value={form.email} onChange={onChange('email')} required />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Téléphone</span>
          <input className="contact-input" value={form.phone} onChange={onChange('phone')} />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Ville</span>
          <input className="contact-input" value={form.city} onChange={onChange('city')} />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Talent</span>
          <div className="contact-select-wrap">
            <select className="contact-select" value={form.talentType} onChange={onChange('talentType')}>
              <option value="">Sélectionner</option>
              <option value="humour">Humour</option>
              <option value="chant">Chant</option>
              <option value="danse">Danse</option>
              <option value="performance">Performance</option>
              <option value="autre">Autre</option>
            </select>
            <span className="contact-select-icon" aria-hidden>
              ▾
            </span>
          </div>
        </label>
      </div>

      <label className="grid gap-2 relative z-10">
        <span className="contact-label">Lien vidéo *</span>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          onChange={onFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.mp4"
        />
        <div className="flex items-center gap-2">
          <input
            className="contact-input flex-1"
            type="url"
            placeholder="https://..."
            value={form.videoLink}
            onChange={onChange('videoLink')}
            required
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-ghost inline-flex items-center justify-center rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.14em] whitespace-nowrap"
          >
            Televerser
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-white/70">{file ? file.name : 'Aucun fichier choisi'}</span>
          {file ? (
            <button
              type="button"
              onClick={() => {
                setFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="text-xs uppercase tracking-[0.16em] text-white/55 hover:text-white transition-colors"
            >
              Retirer
            </button>
          ) : null}
        </div>
      </label>

      <label className="grid gap-2 relative z-10">
        <span className="contact-label">Votre message</span>
        <textarea className="contact-textarea" rows={6} value={form.message} onChange={onChange('message')} />
      </label>

      <label className="hidden" aria-hidden>
        <span>Website</span>
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange('website')} />
      </label>

      <label className="relative z-10 flex items-start gap-3 text-sm text-white/75">
        <input
          className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#d4af37]"
          type="checkbox"
          checked={form.consent}
          onChange={onChange('consent')}
          required
        />
        <span>J’accepte d’être recontacté(e) dans le cadre de ce casting.</span>
      </label>

      <TurnstileField
        onTokenChange={(token) => setForm((prev) => ({ ...prev, turnstileToken: token }))}
        theme="dark"
      />

      <div className="relative z-10" aria-live="polite">
        {error && (
          <div className="contact-status contact-status-error">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div className="grid gap-1">
              <p className="contact-status-title">Envoi interrompu</p>
              <p className="contact-status-body">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="contact-status contact-status-success mt-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div className="grid gap-1">
              <p className="contact-status-title">Candidature envoyée</p>
              <p className="contact-status-body">{success}</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi...' : 'Envoyer ma candidature'}
        </button>
      </div>
    </form>
  )
}
