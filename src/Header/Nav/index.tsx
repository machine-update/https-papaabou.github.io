'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import Link from 'next/link'
import { SearchIcon, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isServicesOpen, setIsServicesOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const searchPanelRef = React.useRef<HTMLDivElement | null>(null)
  const mobileMenuRef = React.useRef<HTMLDivElement | null>(null)
  const menuTriggerRef = React.useRef<HTMLButtonElement | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const handleNavClick = React.useCallback(() => {
    setSearchOpen(false)
    setIsOpen(false)
    setIsServicesOpen(false)
  }, [])
  const navigateWithFallback = React.useCallback(
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      handleNavClick()

      const initialLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`
      window.setTimeout(() => {
        const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`
        if (currentLocation === initialLocation) {
          window.location.assign(href)
        }
      }, 500)
    },
    [handleNavClick],
  )

  React.useEffect(() => {
    setIsOpen(false)
    setIsServicesOpen(false)
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
    { label: 'Productions', href: '/productions' },
    { label: 'Artistes', href: '/artistes' },
    { label: 'Casting', href: '/casting' },
    { label: 'Contact', href: '/contact' },
  ]
  const servicesSubLinks = [
    { label: 'Prestations', href: '/prestations' },
    { label: 'Partenaires', href: '/#partenaires' },
  ]
  const desktopNavLinkClass =
    'relative inline-flex shrink-0 whitespace-nowrap items-center py-1 text-white/95 transition-all duration-300 hover:text-xks-gold hover:[text-shadow:0_0_12px_rgba(219,178,74,0.45)] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-transparent after:via-[#DBB24A] after:to-transparent after:transition-transform after:duration-300 hover:after:scale-x-100'

  return (
    <div className="relative">
      <nav className="hidden md:flex gap-6 items-center text-xs font-semibold uppercase tracking-[0.22em] text-white/95">
        {mainLinks.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={desktopNavLinkClass}
            onClick={navigateWithFallback(item.href)}
            data-track-event="header_nav_click"
            data-track-location="header_desktop"
            data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
          >
            {item.label}
          </Link>
        ))}
        <div className="header-submenu-group">
          <Link
            href="/#services"
            className={desktopNavLinkClass}
            onClick={navigateWithFallback('/#services')}
            data-track-event="header_nav_click"
            data-track-location="header_desktop"
            data-track-label="services"
          >
            Services
          </Link>
          <div className="header-submenu">
            {servicesSubLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header-submenu-link"
                onClick={navigateWithFallback(item.href)}
                data-track-event="header_nav_click"
                data-track-location="header_desktop_services"
                data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {mainLinks.slice(2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={desktopNavLinkClass}
            onClick={navigateWithFallback(item.href)}
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
              className={desktopNavLinkClass}
            />
          )
        })}
        <button
          type="button"
          onClick={() => setSearchOpen((prev) => !prev)}
          className="hover:text-xks-gold transition-colors shrink-0"
          data-track-event="header_nav_click"
          data-track-location="header_desktop"
          data-track-label="search_panel"
          aria-label={searchOpen ? 'Fermer la recherche' : 'Ouvrir la recherche'}
        >
          <span className="sr-only">Recherche</span>
          <SearchIcon className="w-4 text-xks-gold" />
        </button>
        <div className="hidden lg:block">
          <ThemeSelector />
        </div>
      </nav>

      <button
        ref={menuTriggerRef}
        type="button"
        className="menu-trigger md:hidden flex items-center justify-center"
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
        <div className="mobile-menu-float md:hidden" ref={mobileMenuRef}>
          <nav className="mobile-menu-panel">
            {mainLinks.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-menu-link"
                onClick={navigateWithFallback(item.href)}
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
              onClick={() => setIsServicesOpen((prev) => !prev)}
              data-track-event="header_nav_click"
              data-track-location="header_mobile"
              data-track-label="services_submenu"
            >
              Services
              <span aria-hidden>{isServicesOpen ? '−' : '+'}</span>
            </button>
            {isServicesOpen && (
              <div className="mobile-submenu-list">
                {servicesSubLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mobile-submenu-link"
                    onClick={navigateWithFallback(item.href)}
                    data-track-event="header_nav_click"
                    data-track-location="header_mobile_services"
                    data-track-label={item.label.toLowerCase().replace(/\s+/g, '_')}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            {mainLinks.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-menu-link"
                onClick={navigateWithFallback(item.href)}
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
              onClick={navigateWithFallback('/search')}
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
            <div className="pt-2">
              <ThemeSelector />
            </div>
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors hover:bg-white/10"
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
