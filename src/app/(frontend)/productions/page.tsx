import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { SectionFadeIn } from '@/components/SectionFadeIn'
import { getPublicProductionDossiers } from '@/lib/public-content'

export const metadata: Metadata = {
  title: 'Productions | XKSPROD',
  description:
    'Toutes les productions XKSPROD: direction artistique, production exécutive et contenus sur mesure.',
}

export default async function ProductionsPage() {
  const productionDossiers = await getPublicProductionDossiers()

  return (
    <main className="bg-cinema text-white pt-24 md:pt-28 pb-24 md:pb-32 productions-page-modern">
      <SectionFadeIn className="container mb-12 md:mb-16">
        <div className="card glass p-7 md:p-10 stack-lg productions-intro-card">
          <span className="eyebrow productions-intro-kicker">Productions</span>
          <h1 className="productions-intro-title">Nos productions</h1>
          <p className="lead max-w-[50rem] productions-intro-lead">
            Explore nos collections signatures: une lecture claire, élégante et structurée de nos réalisations.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/65 productions-intro-tags">
            <span className="pill">Direction artistique</span>
            <span className="pill">Production exécutive</span>
            <span className="pill">Diffusion premium</span>
          </div>
          <div>
            <Link
              href="/#productions"
              className="btn-ghost inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em] productions-intro-cta"
            >
              Retour accueil
            </Link>
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 productions-grid-modern">
          {productionDossiers.map((dossier) => {
            return (
              <article key={dossier.slug} className="production-card productions-modern-card group">
                <Link href={`/productions/${dossier.slug}`} className="block">
                  <div className="production-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={dossier.coverImage} alt={dossier.name} className="production-image production-dossier-image" />
                  </div>
                </Link>
                <div className="production-content">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">Collection</p>
                  <h2 className="production-directory-title">{dossier.name}</h2>
                  <p className="text-white/70">{dossier.description}</p>
                  <div className="production-badge">{dossier.count} items</div>
                  <div>
                    <Link
                      href={`/productions/${dossier.slug}`}
                      className="btn-ghost inline-flex items-center justify-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em]"
                    >
                      Explorer
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </SectionFadeIn>
    </main>
  )
}
