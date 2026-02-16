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
  youtubeUrl?: string
}

export const productionDossiers: ProductionDossier[] = [
  {
    slug: 'lesambashow',
    name: 'LeSAMBASHOW',
    description: 'Éditions scéniques et captations premium du format Le Samba Show.',
    youtubeUrl: 'https://youtu.be/VpzwJr-dkv0?si=7FMpfjAf_RuGWENz',
  },
  {
    slug: 'mycomedyjam',
    name: 'MYCOMEDYJAM',
    description: 'Univers MyComedyJam: format stand-up éditorial et production live.',
    youtubeUrl: 'https://youtu.be/5GQ0sfCzt_g',
  },
  {
    slug: 'claytonhamilton',
    name: 'CLAYTONHAMILTON',
    description: 'Collection dédiée à l’artiste Clayton Hamilton.',
    youtubeUrl: 'https://youtu.be/ZiCqmWxFHVw',
  },
  {
    slug: 'spectacle-ahmed-sylla',
    name: "SPECTACLE D'AHMED SYLLA",
    description: "Productions liées aux différents visuels du spectacle d'Ahmed Sylla.",
    youtubeUrl: 'https://youtu.be/5aaHscdxThI',
  },
  {
    slug: 'dakarfaitsacomedy',
    name: 'DAKARFAITSACOMEDY',
    description: 'Éditions officielles du format Dakar Fait Sa Comedy.',
    youtubeUrl: 'https://youtu.be/9w_crklR8j8',
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

const strictProductionIdsByDossier: Record<string, number[]> = {
  lesambashow: [4, 7, 9, 10, 11, 13, 14, 15, 19, 21, 22],
  mycomedyjam: [5],
  claytonhamilton: [12],
  'spectacle-ahmed-sylla': [16, 17, 18, 20],
  dakarfaitsacomedy: [1, 2, 3, 6],
}

const dossierById: Record<number, string> = Object.entries(strictProductionIdsByDossier).reduce(
  (acc, [slug, ids]) => {
    ids.forEach((id) => {
      acc[id] = slug
    })
    return acc
  },
  {} as Record<number, string>,
)

const activeProductionIds = Object.values(strictProductionIdsByDossier).flat()

const titleById: Record<number, string> = {
  1: 'DAKAR FAIT SA COMEDY',
  2: 'DAKAR FAIT SA COMEDY',
  3: 'DAKAR FAIT SA COMEDY',
  4: 'Le Samba Show',
  5: 'MyComedyJam',
  6: 'DAKAR FAIT SA COMEDY',
  7: 'Le Samba Show',
  8: 'Le Samba Show',
  9: 'Le Samba Show',
  10: 'Le Samba Show',
  11: 'Le Samba Show',
  12: 'CLAYTONHAMILTON',
  13: 'Le Samba Show',
  14: 'Le Samba Show',
  15: 'Le Samba Show',
  16: "SPECTACLE D'AHMED SYLLA",
  17: "SPECTACLE D'AHMED SYLLA",
  18: "SPECTACLE D'AHMED SYLLA",
  19: 'Le Samba Show',
  20: "SPECTACLE D'AHMED SYLLA",
  21: 'Le Samba Show',
  22: 'Le Samba Show',
}

const defaultDescriptionByDossier: Record<string, string> = {
  lesambashow:
    'Direction artistique, production exécutive et livraison de contenus sur mesure autour du format Le Samba Show.',
  mycomedyjam:
    'Direction artistique et orchestration éditoriale autour du format MyComedyJam.',
  claytonhamilton:
    'Production visuelle dédiée à Clayton Hamilton, avec un traitement premium et une signature scénique claire.',
  'spectacle-ahmed-sylla':
    "Production et déclinaisons visuelles du spectacle d'Ahmed Sylla avec une exécution calibrée.",
  dakarfaitsacomedy:
    'Captation, direction artistique et diffusion de la série Dakar Fait Sa Comedy.',
}

const descriptionById: Record<number, string> = {
  1: 'Affiche officielle de la première édition, avec une direction visuelle orientée grand public et événementiel.',
  2: 'Identité visuelle de la troisième édition, pensée pour porter la programmation et la montée en gamme du format.',
  3: 'Création clé de la deuxième édition, conçue pour renforcer la notoriété du rendez-vous à Dakar.',
  4: 'Visuel principal du Samba Show, conçu pour installer un univers premium et une signature immédiatement reconnaissable.',
  5: 'Direction créative de MyComedyJam: un habillage moderne centré sur le stand-up et la proximité avec le public.',
  6: 'Déclinaison social media dédiée à Dakar Fait Sa Comedy, calibrée pour la promotion digitale et la conversion billetterie.',
  7: 'Version alternative Le Samba Show avec une mise en avant des talents et un storytelling orienté scène.',
  8: 'Déclinaison éditoriale du Samba Show, optimisée pour la communication web et les campagnes partenaires.',
  9: 'Création promotionnelle Le Samba Show avec une composition visuelle centrée sur l’énergie du live.',
  10: 'Habillage événementiel Le Samba Show, conçu pour renforcer l’impact visuel en diffusion multi-supports.',
  11: 'Déploiement visuel Le Samba Show avec un traitement premium et une hiérarchie d’information claire.',
  12: 'Pièce visuelle de la collection Clayton Hamilton, construite autour d’une direction artistique sobre et impactante.',
  13: 'Affiche Le Samba Show orientée branding, pensée pour valoriser l’univers de marque et la lisibilité.',
  14: 'Déclinaison Le Samba Show pour communication institutionnelle et activation événementielle.',
  15: 'Création Le Samba Show dédiée aux opérations terrain, avec une approche graphique directe et efficace.',
  16: "Visuel du spectacle d'Ahmed Sylla, travaillé pour refléter l'identité du show et sa puissance de scène.",
  17: "Déclinaison créative du spectacle d'Ahmed Sylla adaptée aux usages affichage et digital.",
  18: "Version éditoriale du spectacle d'Ahmed Sylla avec une exécution orientée promotion nationale.",
  19: 'Création Le Samba Show centrée sur la cohérence de gamme et la continuité de marque.',
  20: "Habillage de campagne du spectacle d'Ahmed Sylla, conçu pour maintenir une forte reconnaissance visuelle.",
  21: 'Affiche Le Samba Show pensée pour une diffusion rapide et lisible sur tous les formats de communication.',
  22: 'Déclinaison finale Le Samba Show, produite pour soutenir les dernières activations de la saison.',
}

export const productions: ProductionItem[] = activeProductionIds.map((id) => {
  const dossierSlug = dossierById[id]

  return {
    id,
    title: titleById[id],
    meta: productionDossiers.find((d) => d.slug === dossierSlug)?.name || 'Production XKSPROD',
    desc:
      descriptionById[id] ||
      defaultDescriptionByDossier[dossierSlug] ||
      'Production exécutive et direction artistique sur mesure.',
    image: imageById[id],
    dossierSlug,
  }
})

export const getDossierBySlug = (slug: string) =>
  productionDossiers.find((dossier) => dossier.slug === slug) || null

export const getProductionsByDossierSlug = (slug: string) =>
  productions.filter((production) => production.dossierSlug === slug)
