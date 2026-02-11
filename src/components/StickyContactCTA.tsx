import Link from 'next/link'
import React from 'react'

export const StickyContactCTA: React.FC = () => {
  return (
    <div className="sticky-cta-wrapper">
      <Link
        href="/contact"
        className="btn-gold sticky-cta"
        data-track-event="sticky_cta_click"
        data-track-location="global_footer"
        data-track-label="Parler de mon projet"
      >
        Parler de mon projet
      </Link>
    </div>
  )
}
