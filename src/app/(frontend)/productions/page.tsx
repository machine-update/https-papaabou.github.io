import type { Metadata } from 'next'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'

import { SectionFadeIn } from '@/components/SectionFadeIn'
import { getProductionsByDossierSlug, productionDossiers } from '@/data/productions'
import ahmedSyllaImg from './[dossier]/ahmedsylla.png'
import dakarFaitSaComedyImg from './[dossier]/dakarfaitsacomedy.png'
import hamiltonImg from './[dossier]/hamilton.png'
import myComedyJamImg from './[dossier]/mycomedyjamd.png'
import sambaShowImg from './[dossier]/sambashow.png'

export const metadata: Metadata = {
  title: 'Productions | XKSPROD',
  description:
    'Toutes les productions XKSPROD: direction artistique, production exécutive et contenus sur mesure.',
}

const dossierImageBySlug: Record<string, StaticImageData> = {
  lesambashow: sambaShowImg,
  mycomedyjam: myComedyJamImg,
  claytonhamilton: hamiltonImg,
  'spectacle-ahmed-sylla': ahmedSyllaImg,
  dakarfaitsacomedy: dakarFaitSaComedyImg,
}

export default function ProductionsPage() {
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
            const count = getProductionsByDossierSlug(dossier.slug).length
            const dossierImage = dossierImageBySlug[dossier.slug]

            return (
              <article key={dossier.slug} className="production-card productions-modern-card group">
                <Link href={`/productions/${dossier.slug}`} className="block">
                  <div className="production-media">
                    <Image
                      src={dossierImage}
                      alt={dossier.name}
                      className="production-image production-dossier-image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={86}
                    />
                  </div>
                </Link>
                <div className="production-content">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">Collection</p>
                  <h2 className="production-directory-title">{dossier.name}</h2>
                  <p className="text-white/70">{dossier.description}</p>
                  <div className="production-badge">{count} items</div>
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
