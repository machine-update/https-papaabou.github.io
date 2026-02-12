import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

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

  return (
    <main className="bg-cinema text-white pt-24 md:pt-28 pb-24 md:pb-32">
      <section className="container mb-12 md:mb-16">
        <div className="stack-lg">
          <span className="eyebrow">Dossier</span>
          <h1 className="title-display text-4xl md:text-6xl">{dossier.name}</h1>
          <p className="lead max-w-[46rem]">{dossier.description}</p>
          <p className="text-white/65 text-sm uppercase tracking-[0.2em]">{items.length} productions</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/productions"
              className="btn-ghost inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em]"
            >
              Tous les dossiers
            </Link>
            <Link
              href="/#productions"
              className="btn-ghost inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em]"
            >
              Retour accueil
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        {items.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="production-card group">
                <div className="production-media">
                  <img src={item.image} alt={item.title} className="production-image" />
                  <div className="production-badge">{String(item.id).padStart(2, '0')}</div>
                </div>
                <div className="production-content">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">{item.meta}</p>
                  <h2 className="text-2xl">{item.title}</h2>
                  <p className="text-white/70">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card glass p-6">
            <h2 className="text-2xl mb-2">Aucune production dans ce dossier</h2>
            <p className="text-white/70">
              Ce dossier existe mais ne contient pas encore de productions affichables.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
