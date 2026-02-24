import { artists, type Artist } from '@/data/artists'
import { partners as fallbackPartners } from '@/data/partners'
import {
  getProductionsByDossierSlug,
  productionDossiers,
  productions as staticProductions,
  type ProductionDossier,
} from '@/data/productions'
import { prisma } from '@/lib/prisma'

type PublicProductionItem = {
  id: string
  title: string
  meta: string
  desc: string
  image: string
  dossierSlug: string
}

type PublicProductionDossier = ProductionDossier & {
  count: number
  coverImage: string
  youtubeUrl?: string
}

type PublicPrestation = {
  title: string
  description: string
  tags: string[]
}

const fallbackPrestations: PublicPrestation[] = [
  {
    title: 'Production audiovisuelle',
    description: 'Films de marque, captations live, campagnes artistiques et contenus premium conçus pour durer.',
    tags: ['Films', 'Campagnes', 'Captation', 'Post-prod'],
  },
  {
    title: 'Management & direction artistique',
    description: 'Accompagnement créatif, structuration d’image et développement de projets d’artistes.',
    tags: ['Identité', 'Stratégie', 'Brand', 'Mentoring'],
  },
  {
    title: 'Événements live & expériences',
    description: 'Conception et orchestration d’expériences immersives qui marquent le public.',
    tags: ['Scénographie', 'Live', 'Show', 'Immersif'],
  },
]

function toSlug(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function staticProductionsToPublic(): PublicProductionItem[] {
  return staticProductions.map((item) => ({
    id: String(item.id),
    title: item.title,
    meta: item.meta,
    desc: item.desc,
    image: item.image,
    dossierSlug: item.dossierSlug,
  }))
}

function mapDbArtistToPublic(item: {
  slug: string
  name: string
  role: string
  shortBio: string | null
  bio: string
  photo: string
  stats: unknown
  highlights: unknown
  bookingFormats: unknown
  socials: unknown
  featured: boolean
}): Artist {
  const shortBio =
    item.shortBio?.trim() || (item.bio.length > 140 ? `${item.bio.slice(0, 137)}...` : item.bio)
  const stats = Array.isArray(item.stats) ? item.stats : []
  const highlights = Array.isArray(item.highlights) ? item.highlights : []
  const bookingFormats = Array.isArray(item.bookingFormats) ? item.bookingFormats : []
  const socials = Array.isArray(item.socials) ? item.socials : []

  return {
    slug: item.slug,
    name: item.name,
    role: item.role,
    shortBio,
    longBio: item.bio,
    photo: item.photo,
    stats: stats as Artist['stats'],
    highlights: highlights as string[],
    bookingFormats: bookingFormats as string[],
    socials: socials as Artist['socials'],
    featured: item.featured,
  }
}

export async function getPublicArtists() {
  try {
    const dbArtists = await prisma.artiste.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        slug: true,
        name: true,
        role: true,
        shortBio: true,
        bio: true,
        photo: true,
        stats: true,
        highlights: true,
        bookingFormats: true,
        socials: true,
        featured: true,
      },
    })

    if (dbArtists.length > 0) {
      const mappedDb = dbArtists.map(mapDbArtistToPublic)
      const dbSlugs = new Set(mappedDb.map((item) => item.slug))
      const legacyStillNeeded = artists.filter((item) => !dbSlugs.has(item.slug))
      return [...mappedDb, ...legacyStillNeeded]
    }
  } catch (error) {
    console.error('getPublicArtists fallback to static data', error)
  }

  return artists
}

export async function getPublicArtistBySlug(slug: string) {
  const list = await getPublicArtists()
  return list.find((item) => item.slug === slug) || null
}

export async function getPublicFeaturedArtists() {
  const list = await getPublicArtists()
  return list.filter((item) => item.featured)
}

export async function getPublicProductionsByDossierSlug(slug: string): Promise<PublicProductionItem[]> {
  try {
    const all = await prisma.production.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        category: true,
      },
    })

    if (all.length > 0) {
      const fromDb = all
        .filter((item) => toSlug(item.category) === slug)
        .map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.category,
          desc: item.description,
          image: item.image,
          dossierSlug: toSlug(item.category),
        }))

      const staticForSlug = staticProductionsToPublic().filter((item) => item.dossierSlug === slug)
      const dbKeys = new Set(fromDb.map((item) => `${item.title}|${item.image}|${item.dossierSlug}`))
      const missingStatic = staticForSlug.filter(
        (item) => !dbKeys.has(`${item.title}|${item.image}|${item.dossierSlug}`),
      )

      return [...fromDb, ...missingStatic]
    }
  } catch (error) {
    console.error('getPublicProductionsByDossierSlug fallback to static data', error)
  }

  return getProductionsByDossierSlug(slug).map((item) => ({
    id: String(item.id),
    title: item.title,
    meta: item.meta,
    desc: item.desc,
    image: item.image,
    dossierSlug: item.dossierSlug,
  }))
}

export async function getPublicProductionDossiers(): Promise<PublicProductionDossier[]> {
  try {
    const all = await prisma.production.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        category: true,
        description: true,
        image: true,
        youtubeUrl: true,
      },
    })

    if (all.length > 0) {
      const grouped = new Map<string, { name: string; description: string; coverImage: string; count: number; youtubeUrl?: string }>()

      for (const item of all) {
        const slug = toSlug(item.category)
        const existing = grouped.get(slug)
        if (existing) {
          existing.count += 1
          if (!existing.coverImage) existing.coverImage = item.image
          if (!existing.youtubeUrl && item.youtubeUrl) existing.youtubeUrl = item.youtubeUrl
        } else {
          grouped.set(slug, {
            name: item.category,
            description: item.description,
            coverImage: item.image,
            count: 1,
            youtubeUrl: item.youtubeUrl || undefined,
          })
        }
      }

      const staticGrouped = productionDossiers.map((dossier) => {
        const items = getProductionsByDossierSlug(dossier.slug)
        return {
          slug: dossier.slug,
          name: dossier.name,
          description: dossier.description,
          coverImage: items[0]?.image || staticProductions[0]?.image || '/home/works/prod1.jpg',
          count: items.length,
          youtubeUrl: dossier.youtubeUrl,
        }
      })

      for (const dossier of staticGrouped) {
        const existing = grouped.get(dossier.slug)
        if (!existing) {
          grouped.set(dossier.slug, {
            name: dossier.name,
            description: dossier.description,
            coverImage: dossier.coverImage,
            count: dossier.count,
            youtubeUrl: dossier.youtubeUrl,
          })
          continue
        }

        existing.count += dossier.count
        if (!existing.youtubeUrl && dossier.youtubeUrl) existing.youtubeUrl = dossier.youtubeUrl
      }

      return Array.from(grouped.entries()).map(([slug, value]) => ({
        slug,
        name: value.name,
        description: value.description,
        coverImage: value.coverImage,
        count: value.count,
        youtubeUrl: value.youtubeUrl,
      }))
    }
  } catch (error) {
    console.error('getPublicProductionDossiers fallback to static data', error)
  }

  return productionDossiers.map((dossier) => {
    const items = getProductionsByDossierSlug(dossier.slug)
    return {
      ...dossier,
      count: items.length,
      coverImage: items[0]?.image || staticProductions[0]?.image || '/home/works/prod1.jpg',
    }
  })
}

export async function getPublicPartenaires() {
  try {
    const data = await prisma.partenaire.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        logo: true,
        website: true,
      },
    })

    if (data.length > 0) {
      return data.map((item) => ({
        name: item.name,
        mark: item.name.toUpperCase(),
        logo: item.logo || undefined,
        href: item.website || undefined,
      }))
    }
  } catch (error) {
    console.error('getPublicPartenaires fallback to static data', error)
  }

  return fallbackPartners
}

export async function getPublicPrestations() {
  try {
    const data = await prisma.prestation.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        description: true,
      },
    })

    if (data.length > 0) {
      return data.map((item) => ({
        title: item.title,
        description: item.description,
        tags: [],
      }))
    }
  } catch (error) {
    console.error('getPublicPrestations fallback to static data', error)
  }

  return fallbackPrestations
}
