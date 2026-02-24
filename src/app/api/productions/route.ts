import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productionSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'

function toArray(input: unknown) {
  if (!Array.isArray(input)) return []
  return input.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(Number(searchParams.get('page') || '1'), 1)
    const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || '12'), 1), 100)
    const q = (searchParams.get('q') || '').trim()
    const status = (searchParams.get('status') || '').trim()
    const category = (searchParams.get('category') || '').trim()
    const sortBy = (searchParams.get('sortBy') || 'createdAt').trim()
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'
    const allowedSortBy = new Set(['createdAt', 'title', 'category', 'status'])
    const resolvedSortBy = allowedSortBy.has(sortBy) ? sortBy : 'createdAt'

    const where = {
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' as const } },
              { description: { contains: q, mode: 'insensitive' as const } },
              { category: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(status ? { status: status as 'DRAFT' | 'IN_PRODUCTION' | 'COMPLETED' } : {}),
      ...(category ? { category: { equals: category, mode: 'insensitive' as const } } : {}),
    }

    const [total, productions] = await Promise.all([
      prisma.production.count({ where }),
      prisma.production.findMany({
        where,
        include: {
          artistes: { include: { artiste: { select: { id: true, name: true, slug: true } } } },
          partenaires: { include: { partenaire: { select: { id: true, name: true } } } },
        },
        orderBy: { [resolvedSortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({
      data: productions,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    })
  } catch (error) {
    console.error('GET /api/productions failed', error)
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
    const parsed = productionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const artisteIds = toArray(parsed.data.artisteIds)
    const partenaireIds = toArray(parsed.data.partenaireIds)

    const created = await prisma.production.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        image: parsed.data.image,
        category: parsed.data.category,
        youtubeUrl: parsed.data.youtubeUrl || null,
        country: parsed.data.country || null,
        region: parsed.data.region || null,
        viewCount: parsed.data.viewCount,
        watchTimeMinutes: parsed.data.watchTimeMinutes,
        abandonmentRate: parsed.data.abandonmentRate,
        revenueAmount: parsed.data.revenueAmount,
        costAmount: parsed.data.costAmount,
        status: parsed.data.status,
        isActive: parsed.data.isActive,
        tags: parsed.data.tags,
        artistes: {
          create: artisteIds.map((artisteId) => ({ artisteId })),
        },
        partenaires: {
          create: partenaireIds.map((partenaireId) => ({ partenaireId })),
        },
      },
    })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'CREATE',
      entity: 'PRODUCTION',
      entityId: created.id,
      metadata: { title: created.title, status: created.status },
    })

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/productions failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
