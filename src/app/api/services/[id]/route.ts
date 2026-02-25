import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serviceSchema } from '@/lib/validation'
import { getAuthUserFromRequest } from '@/lib/api-auth'
import { revalidateGlobalPublicContent } from '@/lib/public-revalidate'

function deny() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authUser = getAuthUserFromRequest(request)

    if (!authUser || authUser.role !== 'ADMIN') {
      return deny()
    }

    const body = await request.json()
    const parsed = serviceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { id } = await params

    const updated = await prisma.service.update({
      where: { id },
      data: parsed.data,
    })

    revalidateGlobalPublicContent()

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PUT /api/services/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authUser = getAuthUserFromRequest(request)

    if (!authUser || authUser.role !== 'ADMIN') {
      return deny()
    }

    const { id } = await params

    await prisma.service.delete({ where: { id } })

    revalidateGlobalPublicContent()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/services/[id] failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
