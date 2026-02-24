import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { artisteSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'

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
    const parsed = artisteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const { id } = await params

    const updated = await prisma.artiste.update({
      where: { id },
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
      action: 'UPDATE',
      entity: 'ARTISTE',
      entityId: updated.id,
      metadata: { name: updated.name },
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PUT /api/artistes/[id] failed', error)
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

    await prisma.artiste.delete({ where: { id } })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'DELETE',
      entity: 'ARTISTE',
      entityId: id,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/artistes/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
