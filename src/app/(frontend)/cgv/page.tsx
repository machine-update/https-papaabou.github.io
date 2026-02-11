import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'CGV | XKSPROD',
  description: 'Conditions générales de vente de XKSPROD.',
}

export default function CgvPage() {
  return (
    <main className="bg-cinema text-white section-space">
      <div className="container max-w-3xl stack-lg">
        <span className="eyebrow">Juridique</span>
        <h1 className="text-3xl md:text-4xl tracking-tight">Conditions générales de vente</h1>
        <div className="card glass p-6 md:p-8 stack-lg text-white/80">
          <p>
            Les prestations font l’objet d’un devis et d’un calendrier validés avant démarrage.
          </p>
          <p>
            Les conditions de règlement, de livraison et de cession de droits sont détaillées dans chaque
            proposition commerciale.
          </p>
          <p>
            Pour toute demande juridique, contactez hello@xksprod.com.
          </p>
        </div>
      </div>
    </main>
  )
}
