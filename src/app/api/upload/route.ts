import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/api-auth'

const MAX_FILE_SIZE = 6 * 1024 * 1024
const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request)

    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    if (!allowedMime.has(file.type)) {
      return NextResponse.json({ error: 'Format non supporté (jpg, png, webp)' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop lourd (max 6MB)' }, { status: 400 })
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : 'webp'
    const filename = `${Date.now()}-${randomUUID()}.${ext || 'webp'}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'admin')
    const filePath = path.join(uploadDir, filename)

    await fs.mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    await fs.writeFile(filePath, Buffer.from(bytes))

    return NextResponse.json({ url: `/uploads/admin/${filename}` }, { status: 201 })
  } catch (error) {
    console.error('POST /api/upload failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
