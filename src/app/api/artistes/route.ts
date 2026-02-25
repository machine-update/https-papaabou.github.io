import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { artisteSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'
import { seedArtistsFromPublicIfEmpty } from '@/lib/seed-public-data'
import { revalidateAfterArtisteMutation } from '@/lib/public-revalidate'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const seedPublic = searchParams.get('seedPublic') === 'true'
    const page = Math.max(Number(searchParams.get('page') || '1'), 1)
    const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || '12'), 1), 100)
    const q = (searchParams.get('q') || '').trim()
    const active = searchParams.get('active')

    if (seedPublic) {
      const auth = requireAdmin(request)
      if (auth.errorResponse) return auth.errorResponse
      await seedArtistsFromPublicIfEmpty()
    }

    const where = {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { role: { contains: q, mode: 'insensitive' as const } },
              { shortBio: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(active === 'true' ? { isActive: true } : {}),
      ...(active === 'false' ? { isActive: false } : {}),
    }

    const [total, artistes] = await Promise.all([
      prisma.artiste.count({ where }),
      prisma.artiste.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({
      data: artistes,
      meta: { page, pageSize, total, totalPages: Math.max(Math.ceil(total / pageSize), 1) },
    })
  } catch (error) {
    console.error('GET /api/artistes failed', error)
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
    const parsed = artisteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const created = await prisma.artiste.create({
      data: {
        ...parsed.data,
        country: parsed.data.country || null,
        region: parsed.data.region || null,
        shortBio: parsed.data.shortBio || null,
        featured: Boolean(parsed.data.featured),
        isActive: Boolean(parsed.data.isActive),
      },
    })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'CREATE',
      entity: 'ARTISTE',
      entityId: created.id,
      metadata: { name: created.name },
    })

    revalidateAfterArtisteMutation({ slug: created.slug })

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/artistes failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
