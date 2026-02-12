import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { getProductionsByDossierSlug, productionDossiers } from '@/data/productions'

export const metadata: Metadata = {
  title: 'Productions | XKSPROD',
  description:
    'Toutes les productions XKSPROD: direction artistique, production exécutive et contenus sur mesure.',
}

export default function ProductionsPage() {
  return (
    <main className="bg-cinema text-white pt-24 md:pt-28 pb-24 md:pb-32">
      <section className="container mb-12 md:mb-16">
        <div className="stack-lg">
          <span className="eyebrow">Productions</span>
          <h1 className="title-display text-4xl md:text-6xl">Dossiers de productions</h1>
          <p className="lead max-w-[46rem]">
            Choisis un dossier pour afficher uniquement les productions concernées.
          </p>
          <div>
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productionDossiers.map((dossier) => {
            const count = getProductionsByDossierSlug(dossier.slug).length

            return (
              <article key={dossier.slug} className="production-card group">
                <Link href={`/productions/${dossier.slug}`} className="production-media block">
                  <img src={dossier.coverImage} alt={dossier.name} className="production-image" />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute inset-0 dot-matrix opacity-25" />
                  <div className="production-badge">{count} items</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl leading-tight">{dossier.name}</h2>
                  </div>
                </Link>
                <div className="production-content">
                  <p className="text-white/70">{dossier.description}</p>
                  <div>
                    <Link
                      href={`/productions/${dossier.slug}`}
                      className="btn-ghost inline-flex items-center justify-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em]"
                    >
                      Ouvrir le dossier
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
