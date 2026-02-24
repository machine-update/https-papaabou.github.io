export type PublicPartner = {
  name: string
  mark: string
  logo?: string
  href?: string
}

export const partners: PublicPartner[] = [
  { name: 'MyTeleVision', mark: 'MYTELEVISION', logo: '/partners/mytelevision.png', href: 'https://www.mytelevision.tv/' },
  { name: 'D5tv', mark: 'D5 TV', logo: '/partners/d5tv.png', href: 'https://www.d5tv.fr/' },
  { name: 'D5music', mark: 'D5 MUSIC', logo: '/partners/d5music.png', href: 'https://d5music.tv/' },
  { name: 'MyComedy', mark: 'MY COMEDY', logo: '/partners/mycomedy.png', href: 'https://mycomedy.fr/' },
  { name: 'Galsen', mark: 'Galsen', logo: '/partners/galsen.png', href: 'https://www.galsen.com/' },
  { name: 'XKSMusic', mark: 'XKS MUSIC', logo: '/partners/xksmusic.png', href: 'https://xksmusic.com/' },
  { name: 'XKSApps', mark: 'XKS Apps', logo: '/partners/xksapps.png', href: 'https://www.xksapps.com/' },
  { name: 'XKSDigital', mark: 'XKS Digital', logo: '/partners/xksdigital.png', href: 'https://xksdigital.com/' },
]
