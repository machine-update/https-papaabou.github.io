import { revalidatePath } from 'next/cache'

function toSlug(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function revalidateMany(paths: string[]) {
  const unique = new Set(paths.filter((path) => typeof path === 'string' && path.trim().length > 0))
  for (const path of unique) {
    revalidatePath(path)
  }
}

export function revalidateGlobalPublicContent() {
  revalidateMany([
    '/',
    '/a-propos',
    '/services',
    '/prestations',
    '/productions',
    '/artistes',
    '/casting',
    '/contact',
  ])
}

export function revalidateAfterArtisteMutation(input: { slug?: string | null; previousSlug?: string | null }) {
  revalidateGlobalPublicContent()
  revalidateMany([
    input.slug ? `/artistes/${input.slug}` : '',
    input.previousSlug ? `/artistes/${input.previousSlug}` : '',
  ])
}

export function revalidateAfterProductionMutation(input: {
  category?: string | null
  previousCategory?: string | null
}) {
  revalidateGlobalPublicContent()
  revalidateMany([
    input.category ? `/productions/${toSlug(input.category)}` : '',
    input.previousCategory ? `/productions/${toSlug(input.previousCategory)}` : '',
  ])
}

