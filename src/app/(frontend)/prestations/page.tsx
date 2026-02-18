import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  Camera,
  Clapperboard,
  Compass,
  Megaphone,
  Palette,
  Settings,
  Sparkles,
} from 'lucide-react'

import { CardService } from '@/components/prestations/CardService'
import { PrestationsContactForm } from '@/components/prestations/ContactForm'
import { ProgressBar } from '@/components/prestations/ProgressBar'
import { Reveal } from '@/components/prestations/Reveal'

export const metadata: Metadata = {
  title: 'Prestations Premium | XKSPROD',
  description:
    'Conseil stratégique, direction artistique, production exécutive, captation live, post-production premium et diffusion & amplification. Demandez votre devis XKSPROD.',
}

const services = [
  {
    id: 'conseil-strategique',
    title: 'Conseil stratégique',
    description:
      'Nous cadrons les objectifs business, l’angle créatif et la roadmap éditoriale pour transformer chaque production en levier de performance mesurable.',
    tags: ['Audit', 'Positionnement', 'Roadmap'],
    icon: <Compass className="h-4 w-4" />,
  },
  {
    id: 'direction-artistique',
    title: 'Direction artistique',
    description:
      'Nous construisons une signature visuelle premium cohérente: intention créative, narration visuelle et standards d’exécution alignés à votre marque.',
    tags: ['Moodboard', 'Brand image', 'Narration'],
    icon: <Palette className="h-4 w-4" />,
  },
  {
    id: 'production-executive',
    title: 'Production exécutive',
    description:
      'Pilotage complet du projet de la préparation à la livraison: budget, équipe, planning et qualité finale sans friction opérationnelle.',
    tags: ['Planning', 'Coordination', 'Supervision'],
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: 'captation-live',
    title: 'Captation live',
    description:
      'Réalisation multicaméra événementielle, captation cinéma live pour maximiser l’impact visuel et l’engagement de votre audience.',
    tags: ['Multicam', 'Réalisation live', 'Streaming'],
    icon: <Camera className="h-4 w-4" />,
  },
  {
    id: 'post-production-premium',
    title: 'Post-production premium',
    description:
      'Montage, étalonnage, sound design et finition haut de gamme pour livrer un résultat net, élégant et immédiatement diffusable.',
    tags: ['Montage', 'Color grading', 'Mix audio'],
    icon: <Clapperboard className="h-4 w-4" />,
  },
  {
    id: 'diffusion-amplification',
    title: 'Diffusion & amplification',
    description:
      'Nous orchestrons la diffusion cross-plateformes avec séquençage éditorial, déclinaisons de formats et amplification de la portée.',
    tags: ['Distribution', 'Social formats', 'Amplification'],
    icon: <Megaphone className="h-4 w-4" />,
  },
]

const progressItems = [
  { label: 'Exigence qualité', percent: 98 },
  { label: 'Maîtrise opérationnelle', percent: 96 },
  { label: 'Direction artistique', percent: 95 },
  { label: 'Respect des délais', percent: 94 },
]

const footerLinks = [
  { label: 'À propos', href: '/a-propos' },
  { label: 'Productions', href: '/productions' },
  { label: 'Contact', href: '/contact' },
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Prestations XKSPROD',
  provider: {
    '@type': 'Organization',
    name: 'XKSPROD',
    url: 'https://xksprod.com',
  },
  areaServed: 'France, Europe, Afrique (notamment Sénégal)',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Prestations audiovisuelles premium',
    itemListElement: services.map((item) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: item.title,
        description: item.description,
      },
    })),
  },
}

export default function PrestationsPage() {
  return (
    <main className="relative overflow-hidden bg-[#010101] pb-20 pt-20 text-white md:pb-28 md:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_15%_8%,rgba(192,143,60,0.18),transparent_58%),radial-gradient(860px_420px_at_85%_15%,rgba(255,255,255,0.08),transparent_62%),linear-gradient(180deg,#010101_0%,#010101_100%)]" />
      <div className="noise absolute inset-0 pointer-events-none opacity-35" />

      <section className="container relative z-10">
        <Reveal>
          <div className="mx-auto max-w-5xl text-center">
            <p className="eyebrow">Prestations premium</p>
            <h1 className="mt-4 text-4xl tracking-tight text-white md:text-6xl md:leading-[1.02]">
              Nos Prestations
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-xl md:leading-relaxed">
              Conseil, création, production et diffusion: un accompagnement senior pour des contenus
              audiovisuels haut de gamme qui renforcent votre image et accélèrent vos résultats.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="#devis"
                className="btn-gold inline-flex items-center justify-center rounded-full px-7 py-3 text-xs uppercase tracking-[0.22em]"
              >
                Demander un devis
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container relative z-10 mt-14 md:mt-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <CardService
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              tags={service.tags}
              icon={service.icon}
              delayMs={index * 70}
            />
          ))}
        </div>
      </section>

      <section className="container relative z-10 mt-16 md:mt-24">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <Reveal>
            <article className="prest-highlight-shell">
              <div className="grid gap-4">
                <p className="eyebrow">Performance studio</p>
                <h2 className="text-3xl tracking-tight md:text-5xl">Exécution premium, impact durable.</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-white/72 md:text-base">
                  Nous combinons direction artistique senior, maîtrise technique et précision de
                  production pour livrer des contenus visuels lisibles, désirables et mémorables.
                </p>
              </div>

              <div className="mt-8 grid gap-5">
                {progressItems.map((item, index) => (
                  <ProgressBar key={item.label} label={item.label} percent={item.percent} delayMs={index * 120} />
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { value: '15+ ans', label: 'd’expertise terrain' },
                  { value: '60+ projets', label: 'pilotés en premium' },
                  { value: '24-48h', label: 'pour un premier cadrage' },
                ].map((item) => (
                  <div key={item.value} className="prest-kpi-box">
                    <p className="text-xl text-white md:text-2xl">{item.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/58">{item.label}</p>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Reveal delayMs={120}>
              <article className="prest-media-card">
                <Image
                  src="/home/servicetournage.jpg"
                  alt="Plateau de tournage XKSPROD"
                  width={1400}
                  height={920}
                  className="h-56 w-full rounded-xl object-cover md:h-72"
                />
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c08f3c]">Tournage</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/76">
                    Capacité de production adaptable: studio, live, scène, captation événementielle.
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delayMs={180}>
              <article className="prest-media-card">
                <Image
                  src="/home/works/prod11.jpg"
                  alt="Affiche production Le Samba Show"
                  width={900}
                  height={1200}
                  className="h-56 w-full rounded-xl object-cover object-top md:h-72"
                />
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c08f3c]">Production artiste</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/76">
                    Univers visuel fort, storytelling événementiel et coordination technique maîtrisée.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container relative z-10 mt-16 md:mt-24">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Production audiovisuelle',
                body: 'Films de marque, captations live et contenus premium conçus pour durer.',
                tags: ['Films', 'Campagnes', 'Captation'],
              },
              {
                title: 'Management & direction artistique',
                body: 'Accompagnement créatif, structuration d’image et développement de projets d’artistes.',
                tags: ['Identité', 'Stratégie', 'Mentoring'],
              },
              {
                title: 'Événements live & expériences',
                body: 'Conception et orchestration d’expériences immersives qui marquent le public.',
                tags: ['Scénographie', 'Show', 'Immersif'],
              },
            ].map((item) => (
              <article key={item.title} className="prest-mini-card">
                <div className="flex items-center gap-2 text-[#c08f3c]">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.16em]">Format</p>
                </div>
                <h3 className="mt-3 text-xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/72">{item.body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li key={tag} className="prest-tag text-[0.68rem]">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="devis" className="container relative z-10 mt-16 scroll-mt-32 md:mt-24">
        <div className="grid gap-7 xl:grid-cols-[0.42fr_0.58fr]">
          <Reveal>
            <aside className="prest-contact-copy h-full">
              <p className="eyebrow">Brief premium</p>
              <h2 className="mt-3 text-3xl tracking-tight text-white md:text-5xl">
                Parlons de votre prochain projet.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/74 md:text-base">
                Décrivez votre contexte, vos objectifs et votre ambition. Vous recevez un retour
                structuré, clair et orienté résultat dans les meilleurs délais.
              </p>

              <div className="mt-7 grid gap-3">
                {[
                  'Réponse rapide et actionable',
                  'Cadrage budget + planning',
                  'Accompagnement senior de bout en bout',
                ].map((item) => (
                  <div key={item} className="prest-check-item">
                    <span className="h-2 w-2 rounded-full bg-[#c08f3c] shadow-[0_0_0_6px_rgba(192,143,60,0.16)]" />
                    <p className="text-sm text-white/78">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/70">
                <p>+33 1 34 25 86 59</p>
                <p className="mt-1">contact@xksprod.com</p>
              </div>
            </aside>
          </Reveal>

          <PrestationsContactForm />
        </div>
      </section>

      <section className="container relative z-10 mt-16 md:mt-24">
        <Reveal>
          <footer className="prest-footer-cta">
            <div>
              <p className="eyebrow">Contact rapide</p>
              <h2 className="mt-2 text-2xl tracking-tight text-white md:text-4xl">
                Besoin d’un accompagnement premium immédiat ?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/72 md:text-base">
                Notre équipe vous aide à cadrer votre projet, valider le format et lancer une
                production au standard XKSPROD.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em]"
              >
                Contact direct
              </Link>
              <Link
                href="/productions"
                className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/90 transition hover:border-[#c08f3c]/45 hover:text-white"
              >
                Voir nos productions
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.16em] text-white/55">
              <p>© {new Date().getFullYear()} XKSPROD. Tous droits réservés.</p>
              <div className="flex flex-wrap gap-4">
                {footerLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-[#c08f3c]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </Reveal>
      </section>
    </main>
  )
}
