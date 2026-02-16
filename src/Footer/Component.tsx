import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Instagram, Linkedin, Youtube } from 'lucide-react'

export async function Footer() {
  let footerData: Footer
  try {
    footerData = await getCachedGlobal('footer', 1)()
  } catch (error) {
    console.warn('Footer global unavailable, using fallback footer.', error)
    footerData = { navItems: [] } as unknown as Footer
  }

  const navItems = (footerData?.navItems || []).filter(({ link }) => {
    const haystack = `${link?.label || ''} ${link?.url || ''}`.toLowerCase()
    return !haystack.includes('payload')
  })
  const quickLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Artistes', href: '/artistes' },
    { label: 'Prestations', href: '/prestations' },
    { label: 'Productions', href: '/productions' },
    { label: 'Recherche', href: '/search' },
    { label: 'Contact', href: '/contact' },
  ]
  const legalLinks = [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Politique de confidentialité', href: '/confidentialite' },
    { label: 'CGV', href: '/cgv' },
  ]
  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  ]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer-dark mt-auto border-t border-border bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 dot-matrix opacity-10 pointer-events-none" />
      <div className="container relative z-10 py-12 md:py-16 grid gap-8">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-4">
          <div className="stack-lg">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>
            <p className="text-white/65 text-sm max-w-[24rem]">
              Studio premium de production audiovisuelle, direction artistique et live experiences.
            </p>
            <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-[0.2em]">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pill hover:border-[rgba(241,155,50,0.45)] transition-colors"
                  data-track-event="footer_social_click"
                  data-track-location="footer_brand"
                  data-track-label={item.label.toLowerCase()}
                  aria-label={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="stack-lg">
            <h3 className="text-sm uppercase tracking-[0.22em] text-white/60">Navigation</h3>
            <nav className="grid gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/80 hover:text-xks-gold transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
              {navItems.map(({ link }, i) => (
                <CMSLink
                  className="text-white/80 hover:text-xks-gold transition-colors text-sm"
                  key={`${link?.label || 'link'}-${i}`}
                  {...link}
                />
              ))}
            </nav>
          </div>

          <div className="stack-lg">
            <h3 className="text-sm uppercase tracking-[0.22em] text-white/60">Contact</h3>
            <div className="grid gap-2 text-sm text-white/80">
              <a href="mailto:contact@xksprod.com" className="hover:text-xks-gold transition-colors">
                contact@xksprod.com
              </a>
              <a href="tel:+33134258659" className="hover:text-xks-gold transition-colors">
                +33 1 34 25 86 59
              </a>
              <p>Paris, France</p>
              <p className="text-white/60">Réponse moyenne: 24 à 48h</p>
            </div>
          </div>

          <div className="stack-lg">
            <h3 className="text-sm uppercase tracking-[0.22em] text-white/60">Newsletter</h3>
            <p className="text-sm text-white/70">
              Études de cas, coulisses de prod et disponibilités du studio.
            </p>
            <form className="flex gap-2" action="mailto:contact@xksprod.com" method="post">
              <input
                type="email"
                required
                placeholder="Votre email"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-[rgba(241,155,50,0.45)]"
              />
              <button
                type="submit"
                className="btn-gold inline-flex items-center justify-center rounded-full px-4 text-xs uppercase tracking-[0.2em]"
                data-track-event="footer_newsletter_submit"
                data-track-location="footer_newsletter"
                data-track-label="newsletter"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xs uppercase tracking-[0.18em] text-white/50">
            © {currentYear} XKSPROD. Tous droits réservés.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ThemeSelector />
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-[0.18em] text-white/60 hover:text-xks-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
