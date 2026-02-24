import { artists } from '@/data/artists'
import { partners } from '@/data/partners'
import { prisma } from '@/lib/prisma'

export async function seedArtistsFromPublicIfEmpty() {
  const count = await prisma.artiste.count()
  if (count > 0) return false

  await prisma.artiste.createMany({
    data: artists.map((item) => ({
      name: item.name,
      slug: item.slug,
      role: item.role,
      shortBio: item.shortBio || null,
      bio: item.longBio || item.shortBio,
      photo: item.photo,
      stats: item.stats || [],
      highlights: item.highlights || [],
      bookingFormats: item.bookingFormats || [],
      socials: item.socials || [],
      featured: Boolean(item.featured),
      isActive: true,
    })),
    skipDuplicates: true,
  })

  return true
}

export async function seedPartnersFromPublicIfEmpty() {
  const count = await prisma.partenaire.count()
  if (count > 0) return false

  await prisma.partenaire.createMany({
    data: partners.map((item) => ({
      name: item.name,
      logo: item.logo || null,
      website: item.href || null,
      isActive: true,
    })),
  })

  return true
}
