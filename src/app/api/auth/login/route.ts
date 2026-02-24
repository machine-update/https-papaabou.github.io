import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validation'
import { setAuthCookie, signAuthToken, verifyPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signAuthToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
    })

    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error('POST /api/auth/login failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
