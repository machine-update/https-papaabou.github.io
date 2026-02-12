import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { ExternalLink } from 'lucide-react'
import { PartnerLogo } from '@/components/PartnerLogo'
import { ArtistPhoto } from '@/components/ArtistPhoto'
import { featuredArtists } from '@/data/artists'

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
  title: 'Depuis plus de 10 ans, nous produisons des artistes et des spectacles qui marquent.',
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

const works = [
  {
    title: 'Le Samba Show — Églingué le Cinéma',
    meta: 'Show événementiel · Mars 2013 · Folies Bergère',
    desc: 'Production complète du show, direction artistique, coordination plateau et communication visuelle.',
    image: '/home/works/prod11.jpg',
  },
  {
    title: 'Le Samba Show — Dîner Spectacle',
    meta: 'Format premium · Décembre 2014 · Cabaret Sauvage',
    desc: 'Concept événementiel premium mêlant scène, ambiance et expérience immersive à forte valeur public.',
    image: '/home/works/prod12.jpg',
  },
  {
    title: 'Dakar Fait Sa Comedy',
    meta: 'Grand format humour · Mars 2018 · Dakar',
    desc: 'Production show de grande audience, orchestration artistique et déploiement de communication terrain + digital.',
    image: '/home/works/prod14.png',
  },
]

const testimonials = [
  {
    quote:
      'XKSPROD a donné une forme claire à notre univers. Tout était précis, fluide, et d’un niveau rare.',
    name: 'Directrice artistique, Maison Éclipse',
  },
  {
    quote:
      'Le résultat a dépassé nos attentes. Ils comprennent la vision et savent l’exécuter avec rigueur.',
    name: 'Producteur, Live Nocturne',
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

export default function HomePage() {
  return (
    <main className="bg-cinema text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLdJson) }}
      />
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32">
        <div className="absolute inset-0 hero-frame" />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 noise" />

        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="stack-xl">
              <div className="flex items-center gap-3">
                <span className="pulse-dot" />
                <span className="eyebrow">Production d’artistes & spectacles</span>
              </div>

              <div className="stack-lg">
                <h1 className="title-display tracking-tight">
                  XKSPROD, depuis plus de 12 ans, nous produisons des artistes et des spectacles.
                </h1>
                <p className="lead max-w-[38rem]">
                  Une équipe de professionnels expérimentés à votre écoute, pour créer l’outil de
                  communication qui vous correspond et réaliser avec vous un événement unique.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-sm tracking-wide"
                  data-track-event="hero_cta_click"
                  data-track-location="hero"
                  data-track-label="demarrer_un_projet"
                >
                  Démarrer un projet
                </Link>
                <Link
                  href="/posts"
                  className="btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-sm tracking-wide"
                  data-track-event="hero_cta_click"
                  data-track-location="hero"
                  data-track-label="voir_productions"
                >
                  Voir nos productions
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.22em] text-white/60">
                <span>12+ ans d’expertise</span>
                <span>Écoute client</span>
                <span>Accompagnement sur-mesure</span>
                <span>Événements uniques</span>
              </div>
            </div>

            <div className="relative">
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/home/image.webp"
                    alt="Signature visuelle XKSPROD"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 dot-matrix opacity-25" />
                  <div className="absolute bottom-5 left-6">
                    <div className="pill text-xs text-white/80">Studio actif depuis 12+ ans</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['12+ ans', '60+ projets', 'Europe'].map((item) => (
                    <div key={item} className="card glass p-4 text-center text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-space">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr] items-start">
            <div className="stack-lg">
              <span className="eyebrow">Ce que nous construisons</span>
              <h2 className="text-3xl md:text-4xl tracking-tight">
                Une architecture d’émotions, de récit et de performance.
              </h2>
              <p className="lead">
                Notre force n’est pas d’empiler les effets. Elle réside dans la précision — le rythme
                de lecture, les plans qui respirent, l’intention derrière chaque choix.
              </p>
              <div className="services-photo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home/servicetournage.jpg"
                  alt="Coulisses de production XKSPROD"
                  className="services-photo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="grid gap-5">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="card glass p-6 card-hover relative overflow-hidden"
                >
                  <div className="sheen opacity-0 absolute inset-0" />
                  <h3 className="text-xl mb-2">{service.title}</h3>
                  <p className="text-white/70 mb-4">{service.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="pill text-xs text-white/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-black/35 border-y border-white/5">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr] items-start">
            <div className="stack-lg">
              <span className="eyebrow">Qui sommes-nous</span>
              <h2 className="text-3xl md:text-5xl tracking-tight">{companyStory.title}</h2>
              <p className="lead">{companyStory.body}</p>
              <p className="lead">{companyStory.body2}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/a-propos" className="btn-ghost rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]">
                  Découvrir XKSPROD
                </Link>
                <Link href="/contact" className="btn-gold rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]">
                  Nous parler de votre projet
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                'Production d’artistes et de spectacles',
                'Conseil stratégique, exécution premium, suivi de bout en bout',
                'Approche sur-mesure orientée résultat et image de marque',
              ].map((item) => (
                <article key={item} className="list-item">
                  <div className="bullet-gold" />
                  <p className="text-white/75">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-black/40 border-y border-white/5">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr]">
            <div className="stack-lg">
              <span className="eyebrow">Méthode</span>
              <h2 className="text-3xl md:text-4xl tracking-tight">Un process conçu pour l’exigence.</h2>
              <p className="lead">
                Une approche structurée, claire et collaborative — conçue pour livrer un résultat
                cohérent, premium et exploitable.
              </p>
            </div>
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <div key={step.title} className="list-item">
                  <div className="icon-ring text-xs font-semibold">0{index + 1}</div>
                  <div>
                    <h3 className="text-lg mb-1">{step.title}</h3>
                    <p className="text-white/70">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="productions" className="section-space scroll-mt-32">
        <div className="container">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="stack-lg">
              <span className="eyebrow">Sélection</span>
              <h2 className="text-3xl md:text-4xl tracking-tight">Productions & expériences</h2>
            </div>
            <Link
              href="/posts"
              className="text-sm uppercase tracking-[0.22em] text-xks-gold"
              data-track-event="section_cta_click"
              data-track-location="works_section"
              data-track-label="toutes_les_productions"
            >
              Toutes nos productions
            </Link>
          </div>

          <div className="grid gap-6 mt-10 lg:grid-cols-3">
            {works.map((work) => (
              <div key={work.title} className="card glass p-6 card-hover relative overflow-hidden">
                <div className="work-photo-frame mb-4">
                  <div className="work-photo" style={{ backgroundImage: `url(${work.image})` }} />
                  <div className="work-photo-overlay" />
                </div>
                <div className="relative">
                  <div className="eyebrow mb-2">{work.meta}</div>
                  <h3 className="text-xl mb-3">{work.title}</h3>
                  <p className="text-white/70">{work.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-black/30">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Vision premium',
                body: 'Une esthétique élégante, des cadres précis, une narration limpide.',
              },
              {
                title: 'Exécution rigoureuse',
                body: 'Planning solide, qualité maîtrisée, livrables impeccables.',
              },
              {
                title: 'Accompagnement global',
                body: 'Du concept à la diffusion, nous restons présents à chaque étape.',
              },
            ].map((item) => (
              <div key={item.title} className="stack-lg">
                <div className="bullet-gold" />
                <h3 className="text-xl">{item.title}</h3>
                <p className="text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-white/5 bg-black/35">
        <div className="container">
          <div className="stack-lg mb-10">
            <span className="eyebrow">Formats d&apos;accompagnement</span>
            <h2 className="text-3xl md:text-4xl tracking-tight">Des interfaces de collaboration adaptées à ton niveau d’ambition.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {offerTiers.map((tier) => (
              <div key={tier.name} className="offer-card p-6 relative overflow-hidden">
                <div className="absolute inset-0 cta-panel-noise pointer-events-none" />
                <div className="absolute -top-20 -left-10 w-56 h-56 cta-orb pointer-events-none" />
                <div className="relative z-10">
                  <div className="eyebrow mb-3">{tier.duration}</div>
                  <h3 className="text-xl mb-3">{tier.name}</h3>
                  <p className="text-white/70">{tier.fit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr] items-start">
            <div className="stack-lg">
              <span className="eyebrow">Témoignages</span>
              <h2 className="text-3xl md:text-4xl tracking-tight">Ce que nos clients retiennent.</h2>
              <p className="lead">
                Discrétion, exigence, qualité. Nous construisons des relations longues, fondées sur la
                confiance et le résultat.
              </p>
            </div>
            <div className="grid gap-5">
              {testimonials.map((item) => (
                <div key={item.name} className="card glass p-6">
                  <p className="text-lg">“{item.quote}”</p>
                  <p className="text-white/60 mt-4 text-sm">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-black/25">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr] items-start">
            <div className="stack-lg">
              <span className="eyebrow">FAQ</span>
              <h2 className="text-3xl md:text-4xl tracking-tight">Questions fréquentes avant lancement.</h2>
              <p className="lead">
                Les points les plus demandés avant d’ouvrir un projet avec le studio.
              </p>
            </div>
            <div className="grid gap-4">
              {faqItems.map((item) => (
                <article key={item.q} className="list-item">
                  <div>
                    <h3 className="text-lg mb-2">{item.q}</h3>
                    <p className="text-white/70">{item.a}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-y border-white/5 bg-black/35">
        <div className="container">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <div className="stack-lg">
              <span className="eyebrow">Artistes</span>
              <h2 className="text-3xl md:text-4xl tracking-tight">Talents accompagnés par le studio.</h2>
            </div>
            <Link href="/artistes" className="text-sm uppercase tracking-[0.22em] text-xks-gold">
              Voir tous les artistes
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredArtists.slice(0, 3).map((artist) => (
              <article key={artist.slug} className="artist-card">
                <ArtistPhoto
                  src={artist.photo}
                  alt={artist.name}
                  fallback={artist.name}
                  className="artist-photo h-56"
                />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55 mb-2">{artist.role}</p>
                  <h3 className="text-2xl mb-2">{artist.name}</h3>
                  <p className="text-white/70 mb-4">{artist.shortBio}</p>
                  <Link href={`/artistes/${artist.slug}`} className="btn-ghost rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em]">
                    Voir le profil
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="partenaires" className="section-space border-y border-white/5 bg-black/35">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto stack-lg mb-12">
            <span className="eyebrow">Nos partenaires</span>
            <h2 className="text-3xl md:text-5xl tracking-tight">Un réseau solide, créatif et stratégique.</h2>
            <p className="lead">
              Découvrez les structures avec lesquelles nous collaborons pour créer plus d’impact et
              accélérer chaque projet.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className="partner-card"
                data-track-event="partner_click"
                data-track-location="partners_section"
                data-track-label={partner.name.toLowerCase().replace(/\s+/g, '_')}
              >
                <PartnerLogo alt={`${partner.name} logo`} mark={partner.mark} src={partner.logo} />
                <div className="partner-meta">
                  <span>{partner.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space-xl">
        <div className="container">
          <div className="cta-panel cta-panel-home p-10 md:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 cta-panel-noise pointer-events-none" />
            <div className="absolute -top-20 -left-12 w-72 h-72 cta-orb pointer-events-none" />
            <div className="absolute -bottom-24 right-8 w-80 h-80 cta-orb-soft pointer-events-none" />
            <div className="stack-lg max-w-[38rem] relative z-10">
              <span className="eyebrow">Contact</span>
              <h2 className="text-3xl md:text-4xl tracking-tight">
                Parlons de votre prochain projet.
              </h2>
              <p className="text-white/70">
                Décrivez votre idée, votre contexte et votre ambition. Nous vous répondons avec une
                proposition claire et sur-mesure.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 relative z-10">
              <Link
                href="/contact"
                className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-sm tracking-wide"
                data-track-event="contact_cta_click"
                data-track-location="bottom_cta"
                data-track-label="demarrer_un_projet"
              >
                Démarrer un projet
              </Link>
              <Link
                href="/search"
                className="btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-sm tracking-wide"
                data-track-event="contact_cta_click"
                data-track-location="bottom_cta"
                data-track-label="explorer_le_site"
              >
                Explorer le site
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
