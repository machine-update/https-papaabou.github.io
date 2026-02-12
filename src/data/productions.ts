export type ProductionItem = {
  id: number
  title: string
  meta: string
  desc: string
  image: string
  dossierSlug: string
}

export type ProductionDossier = {
  slug: string
  name: string
  description: string
  coverImage: string
}

export const productionDossiers: ProductionDossier[] = [
  {
    slug: 'lesambashow',
    name: 'LeSAMBASHOW',
    description: 'Productions liées aux formats et événements Le Samba Show.',
    coverImage: '/home/works/prod1.jpg',
  },
  {
    slug: 'mycomedyjam',
    name: 'MYCOMEDYJAM',
    description: 'Formats stand-up, captations et événements liés à MyComedyJam.',
    coverImage: '/home/works/prod6.png',
  },
  {
    slug: 'aucabaretsauvage',
    name: 'AUCABARETSAUVAGE',
    description: 'Productions réalisées autour des formats du Cabaret Sauvage.',
    coverImage: '/home/works/prod10.jpg',
  },
  {
    slug: 'claytonhamilton',
    name: 'CLAYTONHAMILTON',
    description: 'Productions et contenus autour de Clayton Hamilton.',
    coverImage: '/home/works/prod12.jpg',
  },
  {
    slug: 'spectacle-ahmed-sylla',
    name: "Un Spectacle d'Ahmed Sylla",
    description: "Productions liées aux formats du spectacle d'Ahmed Sylla.",
    coverImage: '/home/works/prod16.png',
  },
  {
    slug: 'deglingue-a-la-tele',
    name: 'Deglingue a la tele',
    description: 'Contenus et productions du format Deglingue a la tele.',
    coverImage: '/home/works/prod22.png',
  },
]

const imageById: Record<number, string> = {
  1: '/home/works/prod1.jpg',
  2: '/home/works/prod2.jpg',
  3: '/home/works/prod3.jpg',
  4: '/home/works/prod4.jpg',
  5: '/home/works/prod5.jpg',
  6: '/home/works/prod6.png',
  7: '/home/works/prod7.jpg',
  8: '/home/works/prod8.jpg',
  9: '/home/works/prod9.jpg',
  10: '/home/works/prod10.jpg',
  11: '/home/works/prod11.jpg',
  12: '/home/works/prod12.jpg',
  13: '/home/works/prod13.jpg',
  14: '/home/works/prod14.jpg',
  15: '/home/works/prod15.jpg',
  16: '/home/works/prod16.png',
  17: '/home/works/prod17.png',
  18: '/home/works/prod18.png',
  19: '/home/works/prod19.png',
  20: '/home/works/prod20.png',
  21: '/home/works/prod21.png',
  22: '/home/works/prod22.png',
}

const dossierById: Record<number, string> = {
  1: 'lesambashow',
  2: 'lesambashow',
  3: 'lesambashow',
  4: 'lesambashow',
  5: 'lesambashow',
  6: 'mycomedyjam',
  7: 'mycomedyjam',
  8: 'mycomedyjam',
  9: 'mycomedyjam',
  10: 'aucabaretsauvage',
  11: 'aucabaretsauvage',
  12: 'claytonhamilton',
  13: 'aucabaretsauvage',
  14: 'aucabaretsauvage',
  15: 'aucabaretsauvage',
  16: 'spectacle-ahmed-sylla',
  17: 'spectacle-ahmed-sylla',
  18: 'spectacle-ahmed-sylla',
  19: 'spectacle-ahmed-sylla',
  20: 'spectacle-ahmed-sylla',
  21: 'spectacle-ahmed-sylla',
  22: 'deglingue-a-la-tele',
}

const titleById: Record<number, string> = {
  1: 'Le Samba Show - Dakar Fait Sa Comedy',
  2: 'Le Samba Show - Édition Scène Live',
  3: 'Le Samba Show - Captation Premium',
  4: 'Le Samba Show - Showcase Gold',
  5: 'Le Samba Show - Soirée Signature',
  6: 'MyComedyJam - Saison 1',
  7: 'MyComedyJam - Saison 2',
  8: 'MyComedyJam - Stand-Up Session',
  9: 'MyComedyJam - Plateau Live',
  10: 'Au Cabaret Sauvage - Format 1',
  11: 'Au Cabaret Sauvage - Format 2',
  12: 'Clayton Hamilton - Showcase Unique',
  13: 'Au Cabaret Sauvage - Format 3',
  14: 'Au Cabaret Sauvage - Format 4',
  15: 'Au Cabaret Sauvage - Format 5',
  16: "Un Spectacle d'Ahmed Sylla - Visuel 1",
  17: "Un Spectacle d'Ahmed Sylla - Visuel 2",
  18: "Un Spectacle d'Ahmed Sylla - Visuel 3",
  19: "Un Spectacle d'Ahmed Sylla - Visuel 4",
  20: "Un Spectacle d'Ahmed Sylla - Visuel 5",
  21: "Un Spectacle d'Ahmed Sylla - Visuel 6",
  22: 'Deglingue a la tele - Production Unique',
}

export const productions: ProductionItem[] = Array.from({ length: 22 }, (_, idx) => {
  const id = idx + 1
  const dossierSlug = dossierById[id]

  return {
    id,
    title: titleById[id],
    meta: productionDossiers.find((d) => d.slug === dossierSlug)?.name || 'Production XKSPROD',
    desc: 'Direction artistique, production exécutive et livraison de contenus sur mesure adaptés au public cible.',
    image: imageById[id],
    dossierSlug,
  }
})

export const getDossierBySlug = (slug: string) =>
  productionDossiers.find((dossier) => dossier.slug === slug) || null

export const getProductionsByDossierSlug = (slug: string) =>
  productions.filter((production) => production.dossierSlug === slug)
