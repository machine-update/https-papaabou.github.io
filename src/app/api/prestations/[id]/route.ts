import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prestationSchema } from '@/lib/validation'
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
    const parsed = prestationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const { id } = await params

    const updated = await prisma.prestation.update({ where: { id }, data: parsed.data })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'UPDATE',
      entity: 'PRESTATION',
      entityId: updated.id,
      metadata: { title: updated.title },
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PUT /api/prestations/[id] failed', error)
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

    await prisma.prestation.delete({ where: { id } })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'DELETE',
      entity: 'PRESTATION',
      entityId: id,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/prestations/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
