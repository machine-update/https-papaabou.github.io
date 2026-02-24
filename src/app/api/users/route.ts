import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { userCreateSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if (auth.errorResponse) return auth.errorResponse

    const searchParams = request.nextUrl.searchParams
    const q = (searchParams.get('q') || '').trim()
    const role = (searchParams.get('role') || '').trim()
    const page = Math.max(Number(searchParams.get('page') || '1'), 1)
    const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || '12'), 1), 100)

    const where = {
      ...(q ? { email: { contains: q, mode: 'insensitive' as const } } : {}),
      ...(role === 'ADMIN' ? { role: 'ADMIN' as const } : {}),
      ...(role === 'EDITOR' ? { role: 'EDITOR' as const } : {}),
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, role: true, createdAt: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({
      data: users,
      meta: { page, pageSize, total, totalPages: Math.max(Math.ceil(total / pageSize), 1) },
    })
  } catch (error) {
    console.error('GET /api/users failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rate = guardRateLimit(request, 30, 60_000)
    if (rate.errorResponse) return rate.errorResponse

    const auth = requireAdmin(request)
    if (auth.errorResponse) return auth.errorResponse

    const body = await request.json()
    const parsed = userCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
    }

    const created = await prisma.user.create({
      data: {
        email: parsed.data.email,
        role: parsed.data.role,
        password: await hashPassword(parsed.data.password),
      },
      select: { id: true, email: true, role: true, createdAt: true },
    })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'CREATE',
      entity: 'USER',
      entityId: created.id,
      metadata: { email: created.email, role: created.role },
    })

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/users failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
