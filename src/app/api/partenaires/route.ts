import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { partenaireSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'
import { seedPartnersFromPublicIfEmpty } from '@/lib/seed-public-data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const seedPublic = searchParams.get('seedPublic') === 'true'
    const q = (searchParams.get('q') || '').trim()
    const page = Math.max(Number(searchParams.get('page') || '1'), 1)
    const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || '12'), 1), 100)
    const active = searchParams.get('active')

    if (seedPublic) {
      const auth = requireAdmin(request)
      if (auth.errorResponse) return auth.errorResponse
      await seedPartnersFromPublicIfEmpty()
    }

    const where = {
      ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
      ...(active === 'true' ? { isActive: true } : {}),
      ...(active === 'false' ? { isActive: false } : {}),
    }

    const [total, partenaires] = await Promise.all([
      prisma.partenaire.count({ where }),
      prisma.partenaire.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({
      data: partenaires,
      meta: { page, pageSize, total, totalPages: Math.max(Math.ceil(total / pageSize), 1) },
    })
  } catch (error) {
    console.error('GET /api/partenaires failed', error)
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
    const parsed = partenaireSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const created = await prisma.partenaire.create({
      data: {
        name: parsed.data.name,
        logo: parsed.data.logo || null,
        website: parsed.data.website || null,
        country: parsed.data.country || null,
        region: parsed.data.region || null,
        revenueAmount: parsed.data.revenueAmount,
        riskScore: parsed.data.riskScore,
        isActive: Boolean(parsed.data.isActive),
      },
    })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'CREATE',
      entity: 'PARTENAIRE',
      entityId: created.id,
      metadata: { name: created.name },
    })

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/partenaires failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
