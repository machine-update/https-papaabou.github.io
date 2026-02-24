export const AUTH_COOKIE_NAME = 'xks_admin_token'

export function getAdminJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.PAYLOAD_SECRET || ''

  if (!secret) {
    throw new Error('Missing ADMIN_JWT_SECRET (or PAYLOAD_SECRET) environment variable')
  }

  return secret
}
