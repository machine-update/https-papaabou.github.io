import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Mentions légales | XKSPROD',
  description: 'Mentions légales du site XKSPROD.',
}

export default function MentionsLegalesPage() {
  return (
    <main className="bg-cinema text-white section-space">
      <div className="container max-w-3xl stack-lg">
        <span className="eyebrow">Juridique</span>
        <h1 className="text-3xl md:text-4xl tracking-tight">Mentions légales</h1>
        <div className="card glass p-6 md:p-8 stack-lg text-white/80">
          <p>
            Éditeur du site: XKSPROD
          </p>
          <p>
            Contact: hello@xksprod.com
          </p>
          <p>
            Directeur de publication: XKSPROD
          </p>
          <p>
            Hébergement: à compléter selon votre hébergeur.
          </p>
        </div>
      </div>
    </main>
  )
}
