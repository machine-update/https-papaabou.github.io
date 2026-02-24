import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-guard'

export async function GET(request: NextRequest) {
  try {
    const auth = requireAdmin(request)
    if (auth.errorResponse) return auth.errorResponse

    const searchParams = request.nextUrl.searchParams
    const page = Math.max(Number(searchParams.get('page') || '1'), 1)
    const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || '20'), 1), 100)
    const entity = (searchParams.get('entity') || '').trim()

    const where = entity ? { entity } : {}

    const [total, logs] = await Promise.all([
      prisma.adminActivityLog.count({ where }),
      prisma.adminActivityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({
      data: logs,
      meta: { page, pageSize, total, totalPages: Math.max(Math.ceil(total / pageSize), 1) },
    })
  } catch (error) {
    console.error('GET /api/admin-activity failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
