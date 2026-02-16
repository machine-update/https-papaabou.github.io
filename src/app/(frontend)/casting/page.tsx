import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { CastingForm } from '@/components/casting/CastingForm'

export const metadata: Metadata = {
  title: 'Casting | XKSPROD',
  description:
    'Page casting XKSPROD: candidatez pour les prochains formats, shows et productions scéniques du studio.',
}

const points = [
  'Profils humour, chant, danse et performance live.',
  'Sélection sur dossier + lien vidéo.',
  'Réponse de l’équipe casting sous quelques jours.',
]

export default function CastingPage() {
  return (
    <main className="bg-cinema text-white pt-20 md:pt-24 pb-20 md:pb-28 casting-page-modern">
      <section className="container mb-10 md:mb-14">
        <div className="card glass p-6 md:p-10 casting-hero-shell casting-hero-modern">
          <div className="grid gap-8 lg:grid-cols-[0.52fr_0.48fr] items-start">
            <div className="stack-lg casting-modern-copy">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
                <span>/</span>
                <span className="text-xks-gold">Casting</span>
              </div>

              <div className="stack-md">
                <span className="eyebrow casting-kicker">Casting XKSPROD</span>
                <h1 className="casting-title">Tente ta chance sur nos prochains shows.</h1>
                <p className="lead max-w-[44rem] casting-lead">
                  Envoie ton profil, ton lien vidéo et ton message. Notre équipe sélectionne les talents les plus
                  alignés avec nos productions en cours.
                </p>
              </div>

              <div className="grid gap-2.5 casting-modern-points">
                {points.map((point) => (
                  <div key={point} className="list-item casting-point">
                    <div className="bullet-gold" />
                    <p className="text-white/80">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="stack-sm">
              <div className="casting-poster-frame">
                <Image
                  src="/home/premiumimage.png"
                  alt="Univers casting et production XKSPROD"
                  fill
                  sizes="(max-width: 768px) 100vw, 44vw"
                  className="casting-poster-image"
                  quality={88}
                />
                <div className="casting-poster-overlay" />
              </div>
              <div className="casting-poster-caption-outside">XKSPROD TE DONNE LA CHANCE</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] items-start casting-grid-modern">
          <aside className="casting-info-panel p-6 md:p-8 stack-md">
            <span className="eyebrow">Informations</span>
            <h2 className="text-2xl md:text-3xl">Comment candidater</h2>
            <p className="text-white/75">
              Prépare une courte présentation, un lien vidéo visionnable, et explique ton univers en quelques lignes.
            </p>
            <div className="stack-sm text-white/75">
              <p>1. Remplis le formulaire.</p>
              <p>2. Ajoute ton lien vidéo + ton fichier si nécessaire.</p>
              <p>3. Notre équipe te recontacte si ton profil est retenu.</p>
            </div>
            <div className="text-sm text-white/65">
              Contact direct:{' '}
              <a className="hover:text-xks-gold transition-colors" href="mailto:casting@xksprod.com">
                casting@xksprod.com
              </a>
            </div>
          </aside>

          <CastingForm />
        </div>
      </section>
    </main>
  )
}
