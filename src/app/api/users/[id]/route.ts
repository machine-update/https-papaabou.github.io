import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { userUpdateSchema } from '@/lib/validation'
import { guardRateLimit, requireAdmin } from '@/lib/api-guard'
import { logAdminActivity } from '@/lib/admin-activity'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = guardRateLimit(request, 30, 60_000)
    if (rate.errorResponse) return rate.errorResponse

    const auth = requireAdmin(request)
    if (auth.errorResponse) return auth.errorResponse

    const body = await request.json()
    const parsed = userUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }

    const { id } = await params

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    if (parsed.data.email !== existing.email) {
      const emailUsed = await prisma.user.findUnique({ where: { email: parsed.data.email } })
      if (emailUsed) {
        return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        email: parsed.data.email,
        role: parsed.data.role,
        ...(parsed.data.password ? { password: await hashPassword(parsed.data.password) } : {}),
      },
      select: { id: true, email: true, role: true, createdAt: true },
    })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'UPDATE',
      entity: 'USER',
      entityId: updated.id,
      metadata: { email: updated.email, role: updated.role },
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PUT /api/users/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = guardRateLimit(request, 30, 60_000)
    if (rate.errorResponse) return rate.errorResponse

    const auth = requireAdmin(request)
    if (auth.errorResponse) return auth.errorResponse

    const { id } = await params

    if (auth.authUser.id === id) {
      return NextResponse.json({ error: 'Impossible de supprimer votre propre compte' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })

    await logAdminActivity({
      userId: auth.authUser.id,
      email: auth.authUser.email,
      action: 'DELETE',
      entity: 'USER',
      entityId: id,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/users/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
