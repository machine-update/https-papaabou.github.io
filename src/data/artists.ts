export type Artist = {
  slug: string
  name: string
  role: string
  shortBio: string
  longBio: string
  photo: string
  stats?: Array<{ label: string; value: string }>
  highlights?: string[]
  bookingFormats?: string[]
  socials?: Array<{ label: string; url: string }>
  featured?: boolean
}

export const artists: Artist[] = [
  {
    slug: 'moussier-tombola',
    name: 'Moussier Tombola',
    role: 'Humoriste · Performer',
    shortBio:
      'Figure populaire du divertissement francophone, connu pour son énergie scénique et ses formats viraux.',
    longBio:
      'Moussier Tombola porte un univers unique entre humour, scène et performance live. Son positionnement grand public et sa présence média en font un artiste à fort potentiel d’engagement pour les projets de marque, shows et formats TV.',
    photo: '/artists/moussiertombola.jpg',
    stats: [
      { label: 'Positionnement', value: 'Grand public' },
      { label: 'Format fort', value: 'Show live' },
      { label: 'Langue', value: 'Français' },
    ],
    highlights: [
      'Univers comique identifiable et fort pouvoir de connexion avec le public.',
      'Capacité à performer en TV, digital et événements live.',
      'Profil pertinent pour campagnes marques, activations et spectacles.',
    ],
    bookingFormats: ['Show live', 'Apparition événementielle', 'Collaboration marque', 'Format digital'],
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/' },
      { label: 'YouTube', url: 'https://youtube.com/' },
    ],
    featured: true,
  },
  {
    slug: 'talent-2',
    name: 'Artiste Signature',
    role: 'Chant · Performance',
    shortBio:
      'Projet artistique premium accompagné en direction créative, image et déploiement live.',
    longBio:
      'Artiste accompagné sur la structuration d’image, la cohérence de marque et la montée en puissance scénique. Travail sur storytelling, contenu vidéo et activation multi-plateformes.',
    photo: '/artists/talent-2.jpg',
    stats: [
      { label: 'Positionnement', value: 'Image premium' },
      { label: 'Format fort', value: 'Live + Social' },
      { label: 'Langue', value: 'Français / Anglais' },
    ],
    highlights: [
      'Direction artistique cohérente et signature visuelle forte.',
      'Format adaptable aux campagnes digitales et événements privés.',
    ],
    bookingFormats: ['Showcase', 'Campagne social', 'Activation brand content'],
    featured: true,
  },
  {
    slug: 'talent-3',
    name: 'Artiste Live',
    role: 'Live · Scène',
    shortBio:
      'Présence scénique forte, univers affirmé et capacité à créer des expériences mémorables en public.',
    longBio:
      'Développement orienté scène et performance live: direction artistique, création de formats courts et stratégie de visibilité pour accélérer l’acquisition d’audience.',
    photo: '/artists/talent-3.jpg',
    stats: [
      { label: 'Positionnement', value: 'Live performer' },
      { label: 'Format fort', value: 'Scène' },
      { label: 'Langue', value: 'Français' },
    ],
    highlights: [
      'Excellente présence scénique et forte capacité d’animation.',
      'Format idéal pour tournées, événements et contenus courts.',
    ],
    bookingFormats: ['Concert live', 'Festival', 'Show privé'],
    featured: true,
  },
]

export const featuredArtists = artists.filter((artist) => artist.featured)

export const getArtistBySlug = (slug: string) => artists.find((artist) => artist.slug === slug)
