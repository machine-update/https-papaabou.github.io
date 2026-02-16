import { NextResponse } from 'next/server'

type CastingPayload = {
  fullName: string
  firstName: string
  email: string
  phone: string
  city: string
  talentType: string
  videoLink: string
  message: string
  consent: boolean
  website: string
  attachmentName: string
  attachmentSize: number
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const buildHtmlBody = (data: CastingPayload) => {
  const rows = [
    ['Nom', data.fullName],
    ['Prénom', data.firstName],
    ['Email', data.email],
    ['Téléphone', data.phone || '-'],
    ['Ville', data.city || '-'],
    ['Talent', data.talentType || '-'],
    ['Lien vidéo', data.videoLink],
    ['Fichier', data.attachmentName || '-'],
  ]

  const details = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ddd;"><strong>${escapeHtml(label)}</strong></td><td style="padding:8px 12px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;color:#111;">
      <h2>Nouvelle candidature casting XKSPROD</h2>
      <table style="border-collapse:collapse;margin:16px 0;">${details}</table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(data.message || '-')}</p>
    </div>
  `
}

const sendCastingEmail = async (data: CastingPayload) => {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CASTING_TO_EMAIL || process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || 'XKSPROD <onboarding@resend.dev>'

  if (!apiKey || !to) {
    return { sent: false, reason: 'missing_config' as const }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `Casting: ${data.fullName} ${data.firstName}`,
      html: buildHtmlBody(data),
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Resend casting error', err)
    return { sent: false, reason: 'provider_error' as const }
  }

  return { sent: true as const }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const website = String(formData.get('website') || '')
    if (website) {
      return NextResponse.json({ ok: true, message: 'Candidature reçue.' })
    }

    const fullName = String(formData.get('fullName') || '').trim()
    const firstName = String(formData.get('firstName') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const videoLink = String(formData.get('videoLink') || '').trim()
    const consent = String(formData.get('consent') || '') === 'true'

    if (!fullName || !firstName || !email || !videoLink || !consent) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Merci de compléter les champs obligatoires.',
        },
        { status: 400 },
      )
    }

    const attachment = formData.get('attachment')
    const attachmentName = attachment instanceof File ? attachment.name : ''
    const attachmentSize = attachment instanceof File ? attachment.size : 0

    const payload: CastingPayload = {
      fullName,
      firstName,
      email,
      phone: String(formData.get('phone') || ''),
      city: String(formData.get('city') || ''),
      talentType: String(formData.get('talentType') || ''),
      videoLink,
      message: String(formData.get('message') || ''),
      consent,
      website: '',
      attachmentName,
      attachmentSize,
    }

    console.info('Casting lead received', {
      ...payload,
      at: new Date().toISOString(),
    })

    const emailStatus = await sendCastingEmail(payload)
    if (!emailStatus.sent && emailStatus.reason === 'provider_error') {
      return NextResponse.json(
        {
          ok: false,
          error: 'La candidature est enregistrée, mais l’envoi email a échoué. Réessaie plus tard.',
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Merci, ta candidature a bien été envoyée.',
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Impossible d’envoyer la candidature pour le moment.',
      },
      { status: 500 },
    )
  }
}
