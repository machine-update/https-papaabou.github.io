import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { SectionFadeIn } from '@/components/SectionFadeIn'
import {
  getDossierBySlug,
  getProductionsByDossierSlug,
  productionDossiers,
} from '@/data/productions'

type Args = {
  params: Promise<{
    dossier: string
  }>
}

export async function generateStaticParams() {
  return productionDossiers.map((dossier) => ({ dossier: dossier.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { dossier: dossierParam } = await params
  const dossierSlug = decodeURIComponent(dossierParam).toLowerCase()
  const dossier = getDossierBySlug(dossierSlug)

  if (!dossier) {
    return { title: 'Dossier introuvable | XKSPROD' }
  }

  return {
    title: `${dossier.name} | Productions XKSPROD`,
    description: dossier.description,
  }
}

export default async function ProductionDossierPage({ params }: Args) {
  const { dossier: dossierParam } = await params
  const dossierSlug = decodeURIComponent(dossierParam).toLowerCase()
  const dossier = getDossierBySlug(dossierSlug)

  if (!dossier) {
    notFound()
  }

  const items = getProductionsByDossierSlug(dossier.slug)
  const dossierDisplayTitle = dossier.slug === 'dakarfaitsacomedy' ? 'Dakar Fait Sa Comedy' : dossier.name
  const youtubeId = getYouTubeId(dossier.youtubeUrl)
  const videoLead = `Une immersion rapide dans l'univers ${dossierDisplayTitle}: énergie de scène, direction artistique et identité du format.`
  const productionsLead = `Chaque visuel ci-dessous correspond à une déclinaison de production pensée pour la scène, la diffusion digitale et la communication événementielle.`

  return (
    <main className="bg-cinema text-white pt-24 md:pt-28 pb-24 md:pb-32 production-dossier-page">
      <SectionFadeIn className="container mb-12 md:mb-16">
        <nav className="mb-4 text-xs uppercase tracking-[0.18em] text-white/50 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/productions" className="hover:text-white transition-colors">
            Productions
          </Link>
          <span>/</span>
          <span className="text-white/75">{dossier.name}</span>
        </nav>
        <div className="card glass p-7 md:p-10 stack-lg dossier-hero-card dossier-hero-card-modern">
          <span className="eyebrow">Collection</span>
          <h1 className="dossier-hero-title dossier-hero-title-modern">{dossierDisplayTitle}</h1>
          <p className="lead max-w-[48rem] dossier-hero-lead">{dossier.description}</p>
          <div className="dossier-hero-meta">
            <span className="dossier-meta-pill">{items.length} productions</span>
            <span className="dossier-meta-pill">Direction artistique</span>
            <span className="dossier-meta-pill">Exécution premium</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/productions"
              className="btn-gold inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.16em]"
            >
              Toutes les collections
            </Link>
            <Link
              href="/#productions"
              className="btn-ghost inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.16em]"
            >
              Retour accueil
            </Link>
          </div>
        </div>
      </SectionFadeIn>

      {youtubeId && (
        <SectionFadeIn className="container mb-12 md:mb-16">
          <section className="dossier-video-shell">
            <div className="dossier-video-head">
              <span className="eyebrow">Bande-annonce</span>
              <h2 className="dossier-video-title">Extrait officiel</h2>
              <p className="dossier-video-lead">{videoLead}</p>
            </div>
            <div className="dossier-video-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                title={`Bande-annonce ${dossierDisplayTitle}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="dossier-video-foot">
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.16em]"
              >
                Voir sur YouTube
              </a>
            </div>
          </section>
        </SectionFadeIn>
      )}

      <SectionFadeIn className="container">
        {items.length > 0 ? (
          <div className="stack-lg">
            <div className="dossier-productions-head">
              <span className="eyebrow">Productions</span>
              <h2 className="dossier-video-title">Galerie du dossier</h2>
              <p className="dossier-productions-lead">{productionsLead}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article key={item.id} className="production-card group">
                  <div className="production-media">
                    <img src={item.image} alt={item.title} className="production-image" />
                  </div>
                  <div className="production-content">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/55">{item.meta}</p>
                    <h2 className="production-directory-title">{item.title}</h2>
                    <p className="text-white/70">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="card glass p-6">
            <h2 className="text-2xl mb-2">Aucune production dans ce dossier</h2>
            <p className="text-white/70">
              Ce dossier existe mais ne contient pas encore de productions affichables.
            </p>
          </div>
        )}
      </SectionFadeIn>
    </main>
  )
}

function getYouTubeId(url?: string) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim()
      return id || null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const fromQuery = parsed.searchParams.get('v')
      if (fromQuery) return fromQuery

      const parts = parsed.pathname.split('/').filter(Boolean)
      const embedIndex = parts.findIndex((part) => part === 'embed' || part === 'shorts')
      if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1]
    }

    return null
  } catch {
    return null
  }
}
