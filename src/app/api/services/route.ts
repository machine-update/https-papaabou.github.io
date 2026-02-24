import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serviceSchema } from '@/lib/validation'
import { getAuthUserFromRequest } from '@/lib/api-auth'

function deny() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: services })
  } catch (error) {
    console.error('GET /api/services failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const created = await prisma.service.create({
      data: parsed.data,
    })

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (error) {
    console.error('POST /api/services failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
