import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'

export function deny() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export function tooManyRequests(resetAt: number) {
  return NextResponse.json(
    { error: 'Too many requests', retryAt: new Date(resetAt).toISOString() },
    { status: 429 },
  )
}

export function getRequesterKey(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  return `admin:${ip}`
}

export function requireAdmin(request: NextRequest) {
  const authUser = getAuthUserFromRequest(request)

  if (!authUser || authUser.role !== 'ADMIN') {
    return { errorResponse: deny(), authUser: null }
  }

  return { errorResponse: null, authUser }
}

export function guardRateLimit(request: NextRequest, limit = 120, windowMs = 60_000) {
  const key = getRequesterKey(request)
  const result = checkRateLimit(key, limit, windowMs)
  if (!result.ok) {
    return { errorResponse: tooManyRequests(result.resetAt) }
  }

  return { errorResponse: null }
}
