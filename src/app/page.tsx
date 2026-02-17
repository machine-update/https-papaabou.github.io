import type { Metadata } from 'next'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ExternalLink } from 'lucide-react'
import { PartnerLogo } from '@/components/PartnerLogo'
import { ArtistPhoto } from '@/components/ArtistPhoto'
import { SectionFadeIn } from '@/components/SectionFadeIn'
import { featuredArtists } from '@/data/artists'
import { getProductionsByDossierSlug, productionDossiers } from '@/data/productions'
import ahmedSyllaImg from './(frontend)/productions/[dossier]/ahmedsylla.png'
import dakarFaitSaComedyImg from './(frontend)/productions/[dossier]/dakarfaitsacomedy.png'
import hamiltonImg from './(frontend)/productions/[dossier]/hamilton.png'
import myComedyJamImg from './(frontend)/productions/[dossier]/mycomedyjamd.png'
import sambaShowImg from './(frontend)/productions/[dossier]/sambashow.png'

export const metadata: Metadata = {
  title: 'XKSPROD | Studio premium audiovisuel & artistique',
  description:
    'Studio premium de production audiovisuelle, management d’artistes et événements live. Expériences narratives, direction artistique et exécution maîtrisée.',
}

const services = [
  {
    title: 'Production audiovisuelle',
    desc: 'Films de marque, captations live, campagnes artistiques et contenus premium conçus pour durer.',
    tags: ['Films', 'Campagnes', 'Captation', 'Post‑prod'],
  },
  {
    title: 'Management & direction artistique',
    desc: 'Accompagnement créatif, structuration d’image et développement de projets d’artistes.',
    tags: ['Identité', 'Stratégie', 'Brand', 'Mentoring'],
  },
  {
    title: 'Événements live & expériences',
    desc: 'Conception et orchestration d’expériences immersives qui marquent le public.',
    tags: ['Scénographie', 'Live', 'Show', 'Immersif'],
  },
]

const companyStory = {
  title: 'Depuis plus de 15 ans, nous produisons des artistes et des spectacles qui marquent.',
  body:
    'XKSPROD réunit des professionnels expérimentés, tous guidés par la même exigence: vous écouter, comprendre vos besoins et créer l’outil de communication qui vous correspond réellement.',
  body2:
    'Quel que soit votre projet, nous vous conseillons et vous accompagnons pour construire ensemble un événement unique.',
}

const steps = [
  {
    title: 'Immersion & intention',
    body: 'On écoute, on décante, on définit un angle clair. L’objectif n’est pas de faire plus, mais de faire juste.',
  },
  {
    title: 'Narration & direction',
    body: 'On structure une histoire et un langage visuel cohérents, pensés pour votre audience réelle.',
  },
  {
    title: 'Production maîtrisée',
    body: 'Une exécution précise, une équipe calibrée, des process fluides et un contrôle qualité constant.',
  },
  {
    title: 'Amplification & durée',
    body: 'Des livrables optimisés pour durer, se décliner et amplifier votre impact sur le long terme.',
  },
]

const testimonials = [
  {
    quote:
      'Chaque projet est cadré avec une méthode claire: objectifs, format, planning et niveau de finition attendu.',
    name: 'Approche XKSPROD',
  },
  {
    quote:
      'Notre engagement: une exécution propre, mesurable et cohérente avec votre image, du brief à la livraison.',
    name: 'Engagement studio',
  },
]

const offerTiers = [
  {
    name: 'Sprint Créatif',
    duration: '2 à 3 semaines',
    fit: 'Pour lancer une campagne ou un format test rapidement.',
  },
  {
    name: 'Production Signature',
    duration: '4 à 8 semaines',
    fit: 'Pour un film de marque, une série live ou un dispositif complet.',
  },
  {
    name: 'Partenariat Long Terme',
    duration: 'Trimestriel / Annuel',
    fit: 'Pour structurer un calendrier éditorial et une direction artistique continue.',
  },
]

const faqItems = [
  {
    q: 'Travaillez-vous uniquement avec des artistes ?',
    a: 'Non. Nous accompagnons aussi des marques, agences et institutions qui veulent produire des contenus exigeants.',
  },
  {
    q: 'Pouvez-vous gérer un projet de A à Z ?',
    a: 'Oui. Cadrage, direction artistique, production, post-production et livraison sont couverts par la même équipe.',
  },
  {
    q: 'Comment démarre une collaboration ?',
    a: 'On commence par un call de 30 minutes puis on envoie une proposition claire avec budget, planning et livrables.',
  },
  {
    q: 'Intervenez-vous hors France ?',
    a: 'Oui. Le studio opère en France et en Europe selon le format du projet.',
  },
]

const partners = [
  {
    name: 'MyTeleVision',
    mark: 'MYTELEVISION',
    logo: '/partners/mytelevision.png',
    href: 'https://www.mytelevision.tv/',
  },
  { name: 'D5tv', mark: 'D5 TV', logo: '/partners/d5tv.png', href: 'https://www.d5tv.fr/' },
  { name: 'D5music', mark: 'D5 MUSIC', logo: '/partners/d5music.png', href: 'https://d5music.tv/' },
  { name: 'MyComedy', mark: 'MY COMEDY', logo: '/partners/mycomedy.png', href: 'https://mycomedy.fr/' },
  { name: 'Galsen', mark: 'Galsen', logo: '/partners/galsen.png', href: 'https://www.galsen.com/' },
  { name: 'XKSMusic', mark: 'XKS MUSIC', logo: '/partners/xksmusic.png', href: 'https://xksmusic.com/' },
  { name: 'XKSApps', mark: 'XKS Apps', logo: '/partners/xksapps.png', href: 'https://www.xksapps.com/' },
  { name: 'XKSDigital', mark: 'XKS Digital', logo: '/partners/xksdigital.png', href: 'https://xksdigital.com/' },
  {
    name: 'Le Samba Show',
    mark: 'Le Samba Show',
    logo: '/partners/lesambashow.png',
    href: 'https://www.lesambashow.com/',
  },
  {
    name: 'Dakar Fait Sa Comedy',
    mark: 'Dakar Fait Sa Comedy',
    logo: '/partners/dkfsc.png',
    href: 'https://www.dakarfaitsacomedy.com/',
  },
  {
    name: 'MyComedyJam',
    mark: 'MyComedyJam',
    logo: '/partners/mycomedyjam.png',
    href: 'https://www.mycomedyjam.com/',
  },
]

const organizationLdJson = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XKSPROD',
  url: 'https://www.xksprod.com',
  description:
    'Studio premium de production audiovisuelle, management d’artistes et événements live.',
  areaServed: 'Europe',
}

const dossierImageBySlug: Record<string, StaticImageData> = {
  lesambashow: sambaShowImg,
  mycomedyjam: myComedyJamImg,
  claytonhamilton: hamiltonImg,
  'spectacle-ahmed-sylla': ahmedSyllaImg,
  dakarfaitsacomedy: dakarFaitSaComedyImg,
}

export default function HomePage() {
  return (
    <main className="bg-cinema text-white home-no-serif">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLdJson) }}
      />
      <SectionFadeIn className="home-hero-dark relative overflow-hidden pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="absolute inset-0 hero-frame" />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 noise" />

        <div className="container relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] items-center">
            <div className="stack-lg">
              <div className="flex items-center gap-3">
                <span className="pulse-dot" />
                <span className="eyebrow">Production d’artistes & spectacles</span>
              </div>

              <div className="stack-md">
                <h1 className="title-display hero-title-home tracking-tight">
                  XKSPROD, depuis plus de 15 ans, nous produisons des artistes et des spectacles.
                </h1>
                <p className="lead hero-lead-home max-w-[34rem]">
                  Une équipe de professionnels expérimentés à votre écoute, pour créer l’outil de
                  communication qui vous correspond et réaliser avec vous un événement unique.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-gold inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[0.9rem] tracking-wide"
                  data-track-event="hero_cta_click"
                  data-track-location="hero"
                  data-track-label="demarrer_un_projet"
                >
                  Démarrer un projet
                </Link>
                <Link
                  href="/productions"
                  className="btn-ghost inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[0.9rem] tracking-wide"
                  data-track-event="hero_cta_click"
                  data-track-location="hero"
                  data-track-label="voir_productions"
                >
                  Voir nos productions
                </Link>
              </div>

              <div className="hero-facts-grid">
                <span>15+ ans d’expertise</span>
                <span>Écoute client</span>
                <span>Accompagnement sur-mesure</span>
                <span>Événements uniques</span>
              </div>
            </div>

            <div className="relative home-hero-panel">
              <div className="absolute -inset-6 film-burn" />
              <div className="relative grid gap-4">
                <div className="card glass p-6 gold-outline">
                  <div className="eyebrow mb-3">Signature</div>
                  <p className="text-lg">
                    Quel que soit votre projet, nous vous conseillons et vous accompagnons pour livrer
                    un résultat premium, clair et efficace.
                  </p>
                </div>
                <div className="rounded-[1.4rem] h-56 md:h-64 border border-white/10 relative overflow-hidden">
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/home/image.webp"
                    aria-label="Signature visuelle XKSPROD"
                  >
                    <source src="/home/hero-signature-16s.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 dot-matrix opacity-25" />
                  <div className="absolute bottom-5 left-6">
                    <div className="pill text-xs text-white/80">Studio actif depuis 15+ ans</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['15+ ans', '60+ projets', 'Europe'].map((item) => (
                    <div key={item} className="card glass p-4 text-center text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-16 md:pb-24 home-services-modern">
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="card glass p-6 stack-md hover-rise">
              <h2 className="text-xl">{service.title}</h2>
              <p className="text-white/75">{service.desc}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="pill text-[11px] text-white/65">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-16 md:pb-24 home-story-modern">
        <div className="grid gap-8 lg:grid-cols-[0.6fr_0.4fr] items-start">
          <div className="stack-lg">
            <span className="eyebrow">Notre histoire</span>
            <h2 className="title-display text-4xl md:text-5xl max-w-[54rem]">{companyStory.title}</h2>
            <p className="lead">{companyStory.body}</p>
            <p className="text-white/75 text-lg">{companyStory.body2}</p>
            <aside className="card glass p-6 stack-sm max-w-[38rem]">
              <h3 className="text-2xl">Ce qui fait la différence</h3>
              <ul className="stack-sm text-white/75">
                <li>Équipe senior multidisciplinaire</li>
                <li>Direction artistique forte et cohérente</li>
                <li>Exécution rapide, propre, mesurable</li>
              </ul>
            </aside>
          </div>
          <div className="story-visual-shell">
            <div className="story-photo-frame">
              <Image
                src="/home/premiumimage.png"
                alt="Régie et captation live premium XKSPROD"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={90}
                className="story-photo"
              />
              <div className="story-photo-overlay" />
            </div>
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-20 md:pb-28">
        <div className="stack-lg">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Méthode</span>
              <h2 className="title-display text-4xl md:text-5xl">Un process clair, sans friction.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <article key={step.title} className="card glass p-5 stack-sm">
                <span className="text-xs uppercase tracking-[0.2em] text-xks-gold">0{idx + 1}</span>
                <h3 className="text-xl">{step.title}</h3>
                <p className="text-white/70">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="productions" className="container pb-20 md:pb-28">
        <div className="stack-lg">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="eyebrow">Réalisations</span>
              <h2 className="title-display text-3xl md:text-4xl">Nos productions</h2>
            </div>
            <Link href="/productions" className="btn-ghost rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em]">
              Voir tout
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {productionDossiers.map((dossier) => {
              const count = getProductionsByDossierSlug(dossier.slug).length
              const dossierImage = dossierImageBySlug[dossier.slug]

              return (
                <article key={dossier.slug} className="production-card group">
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
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/55">Collection</p>
                      <span className="pill text-[11px] text-white/70">{count} items</span>
                    </div>
                    <h3 className="production-directory-title">{dossier.name}</h3>
                    <p className="text-white/70">{dossier.description}</p>
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
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-20 md:pb-28">
        <div className="stack-lg">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="eyebrow">Artistes à l’affiche</span>
              <h2 className="title-display text-4xl md:text-5xl">Talents accompagnés</h2>
            </div>
            <Link href="/artistes" className="btn-ghost rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em]">
              Voir la page artistes
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredArtists.map((artist) => (
              <article key={artist.slug} className="artist-card card glass p-4 stack-sm">
                <ArtistPhoto src={artist.photo} alt={artist.name} fallback={artist.name} className="artist-photo h-64" />
                <div className="stack-xs">
                  <h3 className="text-xl">{artist.name}</h3>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/55">{artist.role}</p>
                  <p className="text-white/75 text-sm">{artist.shortBio}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(artist.highlights || []).slice(0, 2).map((item) => (
                    <span key={item} className="pill text-[11px] text-white/65">
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/artistes/${artist.slug}`}
                  className="btn-ghost rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] inline-flex items-center gap-2"
                >
                  Voir profil <ExternalLink size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-20 md:pb-28">
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="card glass p-7">
              <p className="text-xl leading-relaxed">“{item.quote}”</p>
              <footer className="mt-5 text-sm uppercase tracking-[0.18em] text-xks-gold">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-20 md:pb-28">
        <div className="card gradient-border p-[1px] rounded-[1.5rem]">
          <div className="rounded-[1.45rem] bg-black/65 p-8 md:p-10 stack-lg">
            <div>
              <span className="eyebrow">Formats d’accompagnement</span>
              <h2 className="title-display text-4xl md:text-5xl">Choisis le rythme qui colle à ton projet.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {offerTiers.map((tier) => (
                <article key={tier.name} className="card glass p-5 stack-sm">
                  <h3 className="text-2xl">{tier.name}</h3>
                  <p className="text-xks-gold text-sm uppercase tracking-[0.2em]">{tier.duration}</p>
                  <p className="text-white/75">{tier.fit}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-20 md:pb-28">
        <div className="stack-lg">
          <div>
            <span className="eyebrow">Partenaires</span>
            <h2 className="title-display text-4xl md:text-5xl">Ils font confiance à XKSPROD</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <PartnerLogo
                key={partner.name}
                alt={`${partner.name} logo`}
                mark={partner.mark}
                src={partner.logo}
                href={partner.href}
              />
            ))}
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-24 md:pb-32">
        <div className="stack-lg max-w-[56rem]">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2 className="title-display text-4xl md:text-5xl">Questions fréquentes</h2>
          </div>
          <div className="grid gap-3">
            {faqItems.map((item) => (
              <details key={item.q} className="card glass p-5 group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="text-lg">{item.q}</span>
                  <span className="text-xks-gold text-xs uppercase tracking-[0.2em] group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-white/75">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn className="container pb-24 md:pb-36">
        <div className="cta-band stack-md text-center md:text-left md:flex md:items-center md:justify-between md:gap-8">
          <div className="stack-sm">
            <span className="eyebrow">Prêt à produire quelque chose d’unique ?</span>
            <h2 className="title-display text-3xl md:text-4xl">On transforme ton idée en expérience marquante.</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <Link href="/contact" className="btn-gold rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]">
              Démarrer maintenant
            </Link>
            <Link href="/productions" className="btn-ghost rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]">
              Voir nos productions
            </Link>
          </div>
        </div>
      </SectionFadeIn>
    </main>
  )
}
