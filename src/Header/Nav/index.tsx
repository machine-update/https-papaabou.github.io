'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPrestationsOpen, setIsPrestationsOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const searchPanelRef = React.useRef<HTMLDivElement | null>(null)
  const mobileMenuRef = React.useRef<HTMLDivElement | null>(null)
  const menuTriggerRef = React.useRef<HTMLButtonElement | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    setIsOpen(false)
    setIsPrestationsOpen(false)
    setSearchOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  React.useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (searchOpen && searchPanelRef.current && !searchPanelRef.current.contains(target)) {
        setSearchOpen(false)
      }

      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuTriggerRef.current &&
        !menuTriggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [searchOpen, isOpen])

  const navItems = (data?.navItems || []).filter(({ link }) => {
    const haystack = `${link?.label || ''} ${link?.url || ''}`.toLowerCase()
    return !haystack.includes('payload')
  })
  const mainLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'A propos', href: '/a-propos' },
    { label: 'Services', href: '/#services' },
    { label: 'Partenaires', href: '/#partenaires' },
    { label: 'Productions', href: '/#productions' },
    { label: 'Artistes', href: '/artistes' },
    { label: 'Contact', href: '/contact' },
  ]
  const prestationsSubLinks = [
    { label: 'Conseil stratégique', href: '/prestations#conseil-strategique' },
    { label: 'Direction artistique', href: '/prestations#direction-artistique' },
    { label: 'Production exécutive', href: '/prestations#production-executive' },
    { label: 'Captation live', href: '/prestations#captation-live' },
    { label: 'Post-production premium', href: '/prestations#post-production-premium' },
    { label: 'Diffusion & amplification', href: '/prestations#diffusion-amplification' },
  ]

  return (
    <div className="relative">
      <nav className="hidden md:flex gap-6 items-center text-xs uppercase tracking-[0.22em] text-white/80">
        {mainLinks.slice(0, 3).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-xks-gold transition-colors"
            data-track-event="header_nav_click"
            data-track-location="header_desktop"
            data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
          >
            {item.label}
          </Link>
        ))}
        <div className="header-submenu-group">
          <Link
            href="/prestations"
            className="hover:text-xks-gold transition-colors"
            data-track-event="header_nav_click"
            data-track-location="header_desktop"
            data-track-label="prestations"
          >
            Prestations
          </Link>
          <div className="header-submenu">
            {prestationsSubLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header-submenu-link"
                data-track-event="header_nav_click"
                data-track-location="header_desktop_prestations"
                data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {mainLinks.slice(3).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-xks-gold transition-colors"
            data-track-event="header_nav_click"
            data-track-location="header_desktop"
            data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
          >
            {item.label}
          </Link>
        ))}
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className="hover:text-xks-gold transition-colors"
            />
          )
        })}
        <button
          type="button"
          onClick={() => setSearchOpen((prev) => !prev)}
          className="hover:text-xks-gold transition-colors"
          data-track-event="header_nav_click"
          data-track-location="header_desktop"
          data-track-label="search_panel"
          aria-label={searchOpen ? 'Fermer la recherche' : 'Ouvrir la recherche'}
        >
          <span className="sr-only">Recherche</span>
          <SearchIcon className="w-4 text-xks-gold" />
        </button>
      </nav>

      <button
        ref={menuTriggerRef}
        type="button"
        className="menu-trigger flex items-center justify-center"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span className="menu-bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      {isOpen && (
        <div className="mobile-menu-float" ref={mobileMenuRef}>
          <nav className="mobile-menu-panel">
            {mainLinks.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-menu-link"
                data-track-event="header_nav_click"
                data-track-location="header_mobile"
                data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="mobile-submenu-trigger"
              onClick={() => setIsPrestationsOpen((prev) => !prev)}
              data-track-event="header_nav_click"
              data-track-location="header_mobile"
              data-track-label="prestations_submenu"
            >
              Prestations
              <span aria-hidden>{isPrestationsOpen ? '−' : '+'}</span>
            </button>
            {isPrestationsOpen && (
              <div className="mobile-submenu-list">
                {prestationsSubLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mobile-submenu-link"
                    data-track-event="header_nav_click"
                    data-track-location="header_mobile_prestations"
                    data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            {mainLinks.slice(3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-menu-link"
                data-track-event="header_nav_click"
                data-track-location="header_mobile"
                data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="mobile-menu-link"
              data-track-event="header_nav_click"
              data-track-location="header_mobile"
              data-track-label="search"
            >
              Recherche
            </Link>
            <button
              type="button"
              className="mobile-menu-link text-left"
              onClick={() => {
                setIsOpen(false)
                setSearchOpen(true)
              }}
              data-track-event="header_nav_click"
              data-track-location="header_mobile"
              data-track-label="search_panel"
            >
              Rechercher ici
            </button>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="header-search-float" ref={searchPanelRef}>
          <div className="header-search-panel">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Recherche rapide</p>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="menu-trigger flex items-center justify-center"
                aria-label="Fermer la recherche"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <form
              className="search-shell"
              onSubmit={(event) => {
                event.preventDefault()
                router.push(`/search${searchValue.trim() ? `?q=${encodeURIComponent(searchValue.trim())}` : ''}`)
                setSearchOpen(false)
              }}
            >
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tape un mot-clé..."
                className="search-input-modern"
                autoFocus
              />
              <button type="submit" className="btn-gold rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Go
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
