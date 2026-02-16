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
    slug: 'udeyfa',
    name: 'Udeyfa',
    role: 'Artiste · Performance',
    shortBio:
      'Univers visuel fort, présence scénique moderne et formats pensés pour la scène et le digital.',
    longBio:
      'Udeyfa développe une identité artistique contemporaine entre performance live et storytelling visuel. Profil adapté aux événements, collaborations de marque et formats vidéo premium.',
    photo: '/artists/photoudeyfa.jpg',
    stats: [
      { label: 'Positionnement', value: 'Urbain premium' },
      { label: 'Format fort', value: 'Live + Digital' },
      { label: 'Langue', value: 'Français' },
    ],
    highlights: [
      'Image artistique cohérente et impactante.',
      'Capacité d’adaptation aux formats live et contenus courts.',
      'Bonne résonance pour activations culturelles et marque.',
    ],
    bookingFormats: ['Showcase', 'Live', 'Collaboration marque'],
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/' },
      { label: 'YouTube', url: 'https://youtube.com/' },
    ],
    featured: true,
  },
  {
    slug: 'lamya-pry',
    name: 'Lamya Pry',
    role: 'Artiste · Chant',
    shortBio:
      'Voix singulière, image élégante et potentiel fort pour les formats live, éditoriaux et brand content.',
    longBio:
      'Lamya Pry porte un univers artistique raffiné entre musique, interprétation et présence caméra. Son profil s’intègre parfaitement aux shows premium, campagnes créatives et performances scéniques.',
    photo: '/artists/photolamyapry.png',
    stats: [
      { label: 'Positionnement', value: 'Pop / Premium' },
      { label: 'Format fort', value: 'Showcase' },
      { label: 'Langue', value: 'Français / Anglais' },
    ],
    highlights: [
      'Signature vocale identifiable et esthétique soignée.',
      'Facilité à performer en live et en format caméra.',
      'Profil premium pour contenus éditoriaux et campagnes.',
    ],
    bookingFormats: ['Showcase', 'Session live', 'Campagne social'],
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/' },
      { label: 'YouTube', url: 'https://youtube.com/' },
    ],
    featured: true,
  },
  {
    slug: 'backy-et-flashy',
    name: 'Backy et Flashy',
    role: 'Duo · Performance',
    shortBio:
      'Duo énergie live, tonalité moderne et forte capacité d’animation sur scène et digital.',
    longBio:
      'Backy et Flashy proposent un format duo dynamique, calibré pour la scène, les activations événementielles et les contenus à fort engagement. Leur complémentarité artistique crée une signature immédiatement reconnaissable.',
    photo: '/artists/photobackyflashy.png',
    stats: [
      { label: 'Positionnement', value: 'Duo entertainment' },
      { label: 'Format fort', value: 'Live duo' },
      { label: 'Langue', value: 'Français' },
    ],
    highlights: [
      'Forte énergie scénique et interaction public.',
      'Format adaptable aux événements et capsules digitales.',
      'Potentiel viral sur formats courts.',
    ],
    bookingFormats: ['Show live', 'Événementiel', 'Format digital'],
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/' },
      { label: 'YouTube', url: 'https://youtube.com/' },
    ],
    featured: true,
  },
  {
    slug: 'polor',
    name: 'Polor',
    role: 'Artiste · Spoken / Live',
    shortBio:
      'Présence scénique sobre et puissante, univers artistique orienté scène et performance vocale.',
    longBio:
      'Polor développe une ligne artistique marquée par la profondeur de ton, l’élégance et l’intensité scénique. Son profil est pertinent pour formats live premium, soirées signatures et collaborations culturelles.',
    photo: '/artists/photopolor.png',
    stats: [
      { label: 'Positionnement', value: 'Scène premium' },
      { label: 'Format fort', value: 'Live vocal' },
      { label: 'Langue', value: 'Français' },
    ],
    highlights: [
      'Forte empreinte scénique et posture artistique claire.',
      'Convient aux formats intimistes et aux scènes grand public.',
      'Image cohérente pour activations haut de gamme.',
    ],
    bookingFormats: ['Scène live', 'Session acoustique', 'Événement privé'],
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/' },
      { label: 'YouTube', url: 'https://youtube.com/' },
    ],
    featured: true,
  },
]

export const featuredArtists = artists.filter((artist) => artist.featured)

export const getArtistBySlug = (slug: string) => artists.find((artist) => artist.slug === slug)
