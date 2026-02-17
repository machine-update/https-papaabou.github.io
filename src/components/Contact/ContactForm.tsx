'use client'

import React from 'react'
import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { TurnstileField } from '@/components/security/TurnstileField'

type FormState = {
  fullName: string
  email: string
  phone: string
  company: string
  service: string
  budget: string
  timeline: string
  message: string
  website: string
  consent: boolean
  turnstileToken: string
}

const initialState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  timeline: '',
  message: '',
  website: '',
  consent: false,
  turnstileToken: '',
}

export const ContactForm: React.FC = () => {
  const captchaEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  const [form, setForm] = React.useState<FormState>(initialState)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const onChange =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = key === 'consent' ? (event.target as HTMLInputElement).checked : event.target.value
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.fullName || !form.email || !form.message || !form.consent) {
      setError('Merci de remplir les champs obligatoires.')
      return
    }

    if (captchaEnabled && !form.turnstileToken) {
      setError('Merci de valider la vérification anti-bot.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const json = (await response.json()) as { ok: boolean; error?: string; message?: string }

      if (!response.ok || !json.ok) {
        setError(json.error || 'Impossible d’envoyer la demande.')
        setLoading(false)
        return
      }

      setSuccess(json.message || 'Demande envoyée.')
      setForm(initialState)
    } catch {
      setError('Une erreur réseau est survenue. Réessaie dans quelques minutes.')
    } finally {
      setLoading(false)
    }
  }

  const onBackToForm = () => {
    setSuccess(null)
    setError(null)
    setForm(initialState)
  }

  if (success) {
    return (
      <section className="contact-form-panel p-6 md:p-8 relative overflow-hidden grid gap-6 min-h-[24rem] content-center">
        <div className="absolute inset-0 cta-panel-noise pointer-events-none" />
        <div className="absolute -top-16 -right-10 w-56 h-56 cta-orb pointer-events-none" />

        <div className="contact-success-card relative z-10">
          <CheckCircle2 className="w-5 h-5" />
          <div className="grid gap-2">
            <p className="contact-status-title">Brief bien reçu</p>
            <p className="contact-status-body">
              {success} Un membre de l’équipe revient vers vous avec un plan d’action concret.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <button
            type="button"
            onClick={onBackToForm}
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour au formulaire
          </button>
        </div>
      </section>
    )
  }

  return (
    <form onSubmit={onSubmit} className="contact-form-panel p-6 md:p-8 grid gap-5 relative overflow-hidden">
      <div className="absolute inset-0 cta-panel-noise pointer-events-none" />
      <div className="absolute -top-16 -right-10 w-56 h-56 cta-orb pointer-events-none" />

      <div className="grid gap-2 relative z-10">
        <span className="eyebrow">Brief projet</span>
        <h2 className="text-2xl md:text-3xl tracking-tight">Parle-nous de ton besoin</h2>
        <p className="text-white/70">Réponse sous 24-48h avec une proposition claire et actionnable.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 relative z-10">
        <label className="grid gap-2">
          <span className="contact-label">Nom complet *</span>
          <input className="contact-input" value={form.fullName} onChange={onChange('fullName')} required />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Email *</span>
          <input className="contact-input" type="email" value={form.email} onChange={onChange('email')} required />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Téléphone</span>
          <input className="contact-input" value={form.phone} onChange={onChange('phone')} />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Société / Projet</span>
          <input className="contact-input" value={form.company} onChange={onChange('company')} />
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Type de besoin</span>
          <div className="contact-select-wrap">
            <select className="contact-select" value={form.service} onChange={onChange('service')}>
              <option value="">Sélectionner</option>
              <option value="brand-film">Film de marque</option>
              <option value="live-captation">Captation live</option>
              <option value="art-direction">Direction artistique</option>
              <option value="event-production">Production événement</option>
              <option value="other">Autre</option>
            </select>
            <span className="contact-select-icon" aria-hidden>
              ▾
            </span>
          </div>
        </label>
        <label className="grid gap-2">
          <span className="contact-label">Budget estimé</span>
          <div className="contact-select-wrap">
            <select className="contact-select" value={form.budget} onChange={onChange('budget')}>
              <option value="">Sélectionner</option>
              <option value="lt-5k">Moins de 5k€</option>
              <option value="5-15k">5k€ à 15k€</option>
              <option value="15-40k">15k€ à 40k€</option>
              <option value="40k-plus">40k€ et plus</option>
            </select>
            <span className="contact-select-icon" aria-hidden>
              ▾
            </span>
          </div>
        </label>
      </div>

      <label className="grid gap-2 relative z-10">
        <span className="contact-label">Délai souhaité</span>
        <input className="contact-input" value={form.timeline} onChange={onChange('timeline')} />
      </label>

      <label className="grid gap-2 relative z-10">
        <span className="contact-label">Message *</span>
        <textarea
          className="contact-textarea"
          rows={6}
          value={form.message}
          onChange={onChange('message')}
          required
        />
      </label>

      <label className="hidden" aria-hidden>
        <span>Website</span>
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange('website')} />
      </label>

      <label className="relative z-10 flex items-start gap-3 text-sm text-white/75">
        <input
          className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#f19b32]"
          type="checkbox"
          checked={form.consent}
          onChange={onChange('consent')}
          required
        />
        <span>J’accepte d’être recontacté(e) à propos de ma demande.</span>
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
      </div>

      <div className="relative z-10 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>
      </div>
    </form>
  )
}
