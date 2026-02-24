import type { NextRequest } from 'next/server'
import { verifyAuthToken } from './auth'
import { AUTH_COOKIE_NAME } from './auth-constants'

export function getAuthUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAuthToken(token)
}
