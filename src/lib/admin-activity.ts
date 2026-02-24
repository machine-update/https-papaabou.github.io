import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

type Input = {
  userId?: string | null
  email: string
  action: string
  entity: string
  entityId?: string | null
  metadata?: unknown
}

export async function logAdminActivity(input: Input) {
  const metadataValue =
    input.metadata === undefined
      ? undefined
      : input.metadata === null
      ? Prisma.JsonNull
      : (input.metadata as Prisma.InputJsonValue)

  try {
    await prisma.adminActivityLog.create({
      data: {
        userId: input.userId || null,
        email: input.email,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId || null,
        metadata: metadataValue,
      },
    })
  } catch (error) {
    console.error('logAdminActivity failed', error)
  }
}
