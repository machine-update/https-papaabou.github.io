import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const normalizedQuery = query?.trim() || ''
  let posts: {
    docs: unknown[]
    totalDocs: number
  } = {
    docs: [],
    totalDocs: 0,
  }

  try {
    const payload = await getPayload({ config: configPromise })

    posts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
      overrideAccess: false,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
      // pagination: false reduces overhead if you don't need totalDocs
      pagination: false,
      ...(normalizedQuery
        ? {
            where: {
              or: [
                {
                  title: {
                    like: normalizedQuery,
                  },
                },
                {
                  'meta.description': {
                    like: normalizedQuery,
                  },
                },
                {
                  'meta.title': {
                    like: normalizedQuery,
                  },
                },
                {
                  slug: {
                    like: normalizedQuery,
                  },
                },
              ],
            },
          }
        : {}),
    })
  } catch (error) {
    console.warn('Could not run search, DB may not be initialized yet:', error)
  }

  return (
    <div className="pt-28 pb-32">
      <PageClient />
      <div className="container mb-20">
        <div className="max-w-[52rem] mx-auto text-center stack-lg">
          <span className="eyebrow">Recherche</span>
          <h1 className="title-display">Trouve une production rapidement.</h1>
          <p className="lead">
            Tape un mot-clé. Si rien n’est saisi, on affiche les dernières productions publiées.
          </p>
          <form action="/search" method="get" className="search-shell">
            <input
              name="q"
              defaultValue={normalizedQuery}
              placeholder="Ex: live session, brand film, direction artistique..."
              className="search-input-modern"
            />
            <button type="submit" className="btn-gold rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em]">
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">
          <div className="card glass p-8 text-center max-w-[46rem] mx-auto">
            <h2 className="text-2xl mb-3">Aucun résultat pour “{normalizedQuery}”.</h2>
            <p className="text-white/70 mb-6">Essaie un autre mot-clé ou consulte directement les productions.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/search" className="btn-ghost rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em]">
                Réinitialiser la recherche
              </Link>
              <Link href="/productions" className="btn-gold rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em]">
                Voir toutes les productions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Recherche des productions | XKSPROD',
  }
}
