import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ArtistPhoto } from '@/components/ArtistPhoto'
import { artists, getArtistBySlug } from '@/data/artists'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const artist = getArtistBySlug(slug)

  if (!artist) {
    return { title: 'Artiste | XKSPROD' }
  }

  return {
    title: `${artist.name} | Artistes XKSPROD`,
    description: artist.shortBio,
  }
}

export default async function ArtistDetailPage({ params }: Args) {
  const { slug } = await params
  const artist = getArtistBySlug(slug)

  if (!artist) {
    notFound()
  }

  return (
    <main className="bg-cinema text-white pt-20 md:pt-24 pb-20 md:pb-28">
      <section className="container">
        <div className="grid gap-8 lg:grid-cols-[0.44fr_0.56fr] items-start">
          <div className="artist-hero-media p-4">
            <ArtistPhoto src={artist.photo} alt={artist.name} fallback={artist.name} className="artist-photo h-[20rem] md:h-[30rem]" />
          </div>
          <div className="stack-lg">
            <div className="text-xs uppercase tracking-[0.22em] text-white/55">
              <Link href="/artistes" className="hover:text-xks-gold transition-colors">
                Artistes
              </Link>{' '}
              / {artist.name}
            </div>
            <h1 className="text-4xl md:text-6xl tracking-tight">{artist.name}</h1>
            <p className="text-sm uppercase tracking-[0.2em] text-xks-gold">{artist.role}</p>
            <p className="lead">{artist.longBio}</p>

            {artist.stats && artist.stats.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {artist.stats.map((item) => (
                  <article key={item.label} className="card glass p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/55 mb-2">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </article>
                ))}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <article className="card glass p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55 mb-3">Temps forts</p>
                <ul className="grid gap-2">
                  {(artist.highlights || []).map((item) => (
                    <li key={item} className="text-sm text-white/80">{item}</li>
                  ))}
                </ul>
              </article>

              <article className="card glass p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55 mb-3">Formats de booking</p>
                <div className="flex flex-wrap gap-2">
                  {(artist.bookingFormats || []).map((item) => (
                    <span key={item} className="pill text-xs text-white/75">{item}</span>
                  ))}
                </div>

                {artist.socials && artist.socials.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {artist.socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em]"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-gold rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]">
                Booker cet artiste
              </Link>
              <Link href="/artistes" className="btn-ghost rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]">
                Retour artistes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
