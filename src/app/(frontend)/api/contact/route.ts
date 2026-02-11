import { NextResponse } from 'next/server'

type ContactPayload = {
  fullName?: string
  email?: string
  company?: string
  service?: string
  budget?: string
  timeline?: string
  message?: string
  phone?: string
  consent?: boolean
  website?: string
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const buildHtmlBody = (data: Required<Pick<ContactPayload, 'fullName' | 'email' | 'message'>> & ContactPayload) => {
  const rows = [
    ['Nom', data.fullName],
    ['Email', data.email],
    ['Téléphone', data.phone || '-'],
    ['Société', data.company || '-'],
    ['Type de besoin', data.service || '-'],
    ['Budget', data.budget || '-'],
    ['Délai', data.timeline || '-'],
  ]

  const details = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ddd;"><strong>${escapeHtml(label)}</strong></td><td style="padding:8px 12px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;color:#111;">
      <h2>Nouveau lead contact XKSPROD</h2>
      <table style="border-collapse:collapse;margin:16px 0;">${details}</table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(data.message)}</p>
    </div>
  `
}

const sendContactEmail = async (data: Required<Pick<ContactPayload, 'fullName' | 'email' | 'message'>> & ContactPayload) => {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
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
      subject: `Nouveau lead: ${data.fullName}`,
      html: buildHtmlBody(data),
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Resend error', err)
    return { sent: false, reason: 'provider_error' as const }
  }

  return { sent: true as const }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload

    // Honeypot field: if filled by bots, return success without processing.
    if (body?.website) {
      return NextResponse.json({
        ok: true,
        message: 'Merci, votre demande a été envoyée. Nous revenons vers vous sous 24-48h.',
      })
    }

    if (!body?.fullName || !body?.email || !body?.message || body?.consent !== true) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Merci de compléter les champs obligatoires.',
        },
        { status: 400 },
      )
    }

    const payload = {
      fullName: body.fullName,
      email: body.email,
      message: body.message,
      company: body.company || '',
      service: body.service || '',
      budget: body.budget || '',
      timeline: body.timeline || '',
      phone: body.phone || '',
      consent: true,
      website: '',
    }

    console.info('Contact lead received', {
      fullName: payload.fullName,
      email: payload.email,
      company: payload.company,
      service: payload.service,
      budget: payload.budget,
      timeline: payload.timeline,
      phone: payload.phone,
      messageLength: payload.message.length,
      at: new Date().toISOString(),
    })

    const emailStatus = await sendContactEmail(payload)
    if (!emailStatus.sent && emailStatus.reason === 'provider_error') {
      return NextResponse.json(
        {
          ok: false,
          error: 'La demande est enregistrée, mais l’envoi email a échoué. Réessaie dans quelques minutes.',
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Merci, votre demande a été envoyée. Nous revenons vers vous sous 24-48h.',
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Impossible d’envoyer le formulaire pour le moment.',
      },
      { status: 500 },
    )
  }
}
