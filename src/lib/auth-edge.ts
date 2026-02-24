import { jwtVerify } from 'jose'
import { getAdminJwtSecret } from './auth-constants'

export async function verifyAuthTokenEdge(token: string) {
  try {
    const secret = new TextEncoder().encode(getAdminJwtSecret())
    const { payload } = await jwtVerify(token, secret)

    const sub = payload.sub
    const email = typeof payload.email === 'string' ? payload.email : null
    const role = payload.role === 'ADMIN' || payload.role === 'EDITOR' ? payload.role : null

    if (!sub || !email || !role) {
      return null
    }

    return {
      id: sub,
      email,
      role,
    }
  } catch {
    return null
  }
}
