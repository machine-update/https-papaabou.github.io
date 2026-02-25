import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { partenaireSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'
import { revalidateGlobalPublicContent } from '@/lib/public-revalidate'

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
    const parsed = partenaireSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const { id } = await params

    const updated = await prisma.partenaire.update({
      where: { id },
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
      action: 'UPDATE',
      entity: 'PARTENAIRE',
      entityId: updated.id,
      metadata: { name: updated.name },
    })

    revalidateGlobalPublicContent()

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PUT /api/partenaires/[id] failed', error)
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

    await prisma.partenaire.delete({ where: { id } })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'DELETE',
      entity: 'PARTENAIRE',
      entityId: id,
    })

    revalidateGlobalPublicContent()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/partenaires/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
