type VerifyTurnstileArgs = {
  token: string
  ip?: string
}

type VerifyTurnstileResult = {
  ok: boolean
}

export const verifyTurnstileToken = async ({
  token,
  ip,
}: VerifyTurnstileArgs): Promise<VerifyTurnstileResult> => {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // If no secret is configured, keep captcha disabled without blocking requests.
  if (!secret) {
    return { ok: true }
  }

  if (!token) {
    return { ok: false }
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (ip) {
    body.set('remoteip', ip)
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      return { ok: false }
    }

    const json = (await response.json()) as { success?: boolean }
    return { ok: json.success === true }
  } catch {
    return { ok: false }
  }
}
