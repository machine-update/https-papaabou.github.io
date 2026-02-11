import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | XKSPROD',
  description: 'Politique de confidentialité du site XKSPROD.',
}

export default function ConfidentialitePage() {
  return (
    <main className="bg-cinema text-white section-space">
      <div className="container max-w-3xl stack-lg">
        <span className="eyebrow">Juridique</span>
        <h1 className="text-3xl md:text-4xl tracking-tight">Politique de confidentialité</h1>
        <div className="card glass p-6 md:p-8 stack-lg text-white/80">
          <p>
            Les données envoyées via les formulaires sont utilisées uniquement pour répondre aux demandes
            commerciales et opérationnelles.
          </p>
          <p>
            Vous pouvez demander la suppression de vos données à tout moment via hello@xksprod.com.
          </p>
          <p>
            Les mesures de sécurité et la durée de conservation dépendent des outils techniques utilisés
            par le studio.
          </p>
        </div>
      </div>
    </main>
  )
}
