import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prestationSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'
import { revalidateGlobalPublicContent } from '@/lib/public-revalidate'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = (searchParams.get('q') || '').trim()
    const page = Math.max(Number(searchParams.get('page') || '1'), 1)
    const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || '12'), 1), 100)

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [total, prestations] = await Promise.all([
      prisma.prestation.count({ where }),
      prisma.prestation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({
      data: prestations,
      meta: { page, pageSize, total, totalPages: Math.max(Math.ceil(total / pageSize), 1) },
    })
  } catch (error) {
    console.error('GET /api/prestations failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rate = guardRateLimit(request, 40, 60_000)
    if (rate.errorResponse) return rate.errorResponse

    const auth = requireAdmin(request)
    if (auth.errorResponse) return auth.errorResponse

    const body = await request.json()
    const parsed = prestationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const created = await prisma.prestation.create({ data: parsed.data })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'CREATE',
      entity: 'PRESTATION',
      entityId: created.id,
      metadata: { title: created.title },
    })

    revalidateGlobalPublicContent()

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/prestations failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
