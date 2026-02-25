import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productionSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'
import { revalidateAfterProductionMutation } from '@/lib/public-revalidate'

function toArray(input: unknown) {
  if (!Array.isArray(input)) return []
  return input.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params
    const existing = await prisma.production.findUnique({
      where: { id },
      select: { category: true },
    })
    const artisteIds = toArray(parsed.data.artisteIds)
    const partenaireIds = toArray(parsed.data.partenaireIds)

    const updated = await prisma.production.update({
      where: { id },
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
          deleteMany: {},
          create: artisteIds.map((artisteId) => ({ artisteId })),
        },
        partenaires: {
          deleteMany: {},
          create: partenaireIds.map((partenaireId) => ({ partenaireId })),
        },
      },
    })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'UPDATE',
      entity: 'PRODUCTION',
      entityId: updated.id,
      metadata: { title: updated.title, status: updated.status },
    })

    revalidateAfterProductionMutation({
      category: updated.category,
      previousCategory: existing?.category,
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PUT /api/productions/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = guardRateLimit(request, 40, 60_000)
    if (rate.errorResponse) return rate.errorResponse

    const auth = requireAdmin(request)
    if (auth.errorResponse) return auth.errorResponse

    const { id } = await params
    const existing = await prisma.production.findUnique({
      where: { id },
      select: { category: true },
    })

    await prisma.production.delete({ where: { id } })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'DELETE',
      entity: 'PRODUCTION',
      entityId: id,
    })

    revalidateAfterProductionMutation({ previousCategory: existing?.category })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/productions/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
