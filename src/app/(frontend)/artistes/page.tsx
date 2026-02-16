import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { ArtistPhoto } from '@/components/ArtistPhoto'
import { artists } from '@/data/artists'

export const metadata: Metadata = {
  title: 'Artistes | XKSPROD',
  description: 'Découvrez les artistes accompagnés par XKSPROD.',
}

export default function ArtistesPage() {
  return (
    <main className="bg-cinema text-white pt-20 md:pt-24 pb-20 md:pb-28">
      <section className="container mb-12">
        <div className="max-w-4xl stack-lg artistes-page-header">
          <div className="text-xs uppercase tracking-[0.22em] text-white/55">
            <Link href="/" className="hover:text-xks-gold transition-colors">
              Accueil
            </Link>{' '}
            / Artistes
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tight">Nos artistes</h1>
          <p className="lead max-w-3xl">
            Talents accompagnés en image, performance et développement de carrière.
          </p>
        </div>
      </section>

      <section className="container">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <article key={artist.slug} className="artist-card">
              <ArtistPhoto
                src={artist.photo}
                alt={artist.name}
                fallback={artist.name}
                className="artist-photo"
              />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-white/55 mb-2">{artist.role}</p>
                <h2 className="text-2xl mb-3">{artist.name}</h2>
                <p className="text-white/70 mb-5">{artist.shortBio}</p>
                <Link href={`/artistes/${artist.slug}`} className="btn-ghost rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Voir le profil
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
