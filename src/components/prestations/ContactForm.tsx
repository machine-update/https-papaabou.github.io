'use client'

import React from 'react'
import { AlertTriangle, ArrowLeft, CheckCircle2, SendHorizontal } from 'lucide-react'

import { Reveal } from './Reveal'

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
}

type FormErrors = Partial<Record<keyof FormState, string>>

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
}

/* Premium quote request form with inline validation and success/error UI states. */
export function PrestationsContactForm() {
  const [form, setForm] = React.useState<FormState>(initialState)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [loading, setLoading] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const onChange =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = key === 'consent' ? (event.target as HTMLInputElement).checked : event.target.value

      setForm((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => ({ ...prev, [key]: undefined }))
      setSubmitError(null)
    }

  const validate = (state: FormState): FormErrors => {
    const nextErrors: FormErrors = {}

    if (!state.fullName.trim()) nextErrors.fullName = 'Le nom complet est requis.'
    if (!state.email.trim()) {
      nextErrors.email = 'L’email est requis.'
    } else if (!/^\S+@\S+\.\S+$/.test(state.email)) {
      nextErrors.email = 'Merci de saisir un email valide.'
    }

    if (!state.message.trim()) nextErrors.message = 'Décris brièvement ton besoin.'
    if (!state.service.trim()) nextErrors.service = 'Sélectionne le type de prestation.'
    if (!state.consent) nextErrors.consent = 'Ton accord est requis pour être recontacté.'

    return nextErrors
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Certains champs doivent être corrigés avant envoi.')
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
        setSubmitError(json.error || 'Impossible d’envoyer la demande pour le moment.')
        return
      }

      setSuccess(json.message || 'Merci, votre demande a bien été envoyée.')
      setForm(initialState)
      setErrors({})
    } catch {
      setSubmitError('Erreur réseau. Merci de réessayer dans quelques instants.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Reveal>
        <section className="prest-form-shell p-6 md:p-8 min-h-[22rem] content-center">
          <div className="prest-success-box" role="status" aria-live="polite">
            <CheckCircle2 className="h-5 w-5 text-[#78ffbf]" />
            <div className="grid gap-2">
              <p className="prest-status-title">Demande envoyée</p>
              <p className="text-sm leading-relaxed text-white/80">{success}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSuccess(null)
              setSubmitError(null)
            }}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white/85 transition hover:border-[#c08f3c]/50 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au formulaire
          </button>
        </section>
      </Reveal>
    )
  }

  return (
    <Reveal>
      <form onSubmit={onSubmit} className="prest-form-shell p-6 md:p-8" noValidate>
        <div className="grid gap-2">
          <p className="eyebrow">Demande de devis</p>
          <h3 className="text-2xl tracking-tight text-white md:text-3xl">Parle-nous de ton projet</h3>
          <p className="text-sm text-white/70 md:text-base">
            Réponse sous 24-48h avec un cadrage clair: budget, planning, livrables.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="prest-label">Nom complet *</span>
            <input
              className="prest-input"
              value={form.fullName}
              onChange={onChange('fullName')}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              placeholder="Ex. Samba Kanté"
            />
            {errors.fullName && (
              <span id="fullName-error" className="prest-error-field">
                {errors.fullName}
              </span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="prest-label">Email *</span>
            <input
              className="prest-input"
              type="email"
              value={form.email}
              onChange={onChange('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="contact@entreprise.com"
            />
            {errors.email && (
              <span id="email-error" className="prest-error-field">
                {errors.email}
              </span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="prest-label">Téléphone</span>
            <input
              className="prest-input"
              value={form.phone}
              onChange={onChange('phone')}
              placeholder="+33 1 34 25 86 59"
            />
          </label>

          <label className="grid gap-2">
            <span className="prest-label">Société / Projet</span>
            <input
              className="prest-input"
              value={form.company}
              onChange={onChange('company')}
              placeholder="Nom du projet"
            />
          </label>

          <label className="grid gap-2">
            <span className="prest-label">Type de besoin *</span>
            <select
              className="prest-input"
              value={form.service}
              onChange={onChange('service')}
              aria-invalid={!!errors.service}
              aria-describedby={errors.service ? 'service-error' : undefined}
            >
              <option value="">Sélectionner</option>
              <option value="conseil-strategique">Conseil stratégique</option>
              <option value="direction-artistique">Direction artistique</option>
              <option value="production-executive">Production exécutive</option>
              <option value="captation-live">Captation live</option>
              <option value="post-production-premium">Post-production premium</option>
              <option value="diffusion-amplification">Diffusion & amplification</option>
            </select>
            {errors.service && (
              <span id="service-error" className="prest-error-field">
                {errors.service}
              </span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="prest-label">Budget estimé</span>
            <select className="prest-input" value={form.budget} onChange={onChange('budget')}>
              <option value="">Sélectionner</option>
              <option value="lt-10k">Moins de 10k€</option>
              <option value="10-25k">10k€ à 25k€</option>
              <option value="25-50k">25k€ à 50k€</option>
              <option value="50k-plus">50k€ et plus</option>
            </select>
          </label>
        </div>

        <label className="mt-4 grid gap-2">
          <span className="prest-label">Délai souhaité</span>
          <input
            className="prest-input"
            value={form.timeline}
            onChange={onChange('timeline')}
            placeholder="Ex. Lancement sous 6 semaines"
          />
        </label>

        <label className="mt-4 grid gap-2">
          <span className="prest-label">Message *</span>
          <textarea
            className="prest-textarea"
            rows={6}
            value={form.message}
            onChange={onChange('message')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="Contexte, objectifs, livrables attendus, contraintes..."
          />
          {errors.message && (
            <span id="message-error" className="prest-error-field">
              {errors.message}
            </span>
          )}
        </label>

        <label className="hidden" aria-hidden>
          <span>Website</span>
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange('website')} />
        </label>

        <label className="mt-4 flex items-start gap-3 text-sm text-white/75">
          <input
            className="mt-0.5 h-4 w-4 rounded border-white/25 bg-transparent accent-[#c08f3c]"
            type="checkbox"
            checked={form.consent}
            onChange={onChange('consent')}
            aria-invalid={!!errors.consent}
          />
          <span>J’accepte d’être recontacté(e) à propos de ma demande.</span>
        </label>
        {errors.consent && <p className="mt-2 text-xs text-[#ff8d8d]">{errors.consent}</p>}

        <div className="mt-5 grid gap-3" aria-live="polite">
          {submitError && (
            <div className="prest-status-error">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm leading-relaxed">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold inline-flex w-fit items-center justify-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizontal className="h-3.5 w-3.5" />
            {loading ? 'Envoi en cours...' : 'Demander un devis'}
          </button>
        </div>
      </form>
    </Reveal>
  )
}
