import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)

await prisma.user.upsert({
  where: { email },
  update: { password: hash, role: 'ADMIN' },
  create: { email, password: hash, role: 'ADMIN' },
})

console.log(`Admin user ready: ${email}`)
await prisma.$disconnect()
