import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'CGV | XKSPROD',
  description: 'Conditions générales de vente de XKSPROD.',
}

export default function CgvPage() {
  return (
    <main className="bg-cinema text-white section-space">
      <div className="container max-w-4xl stack-lg">
        <span className="eyebrow">Juridique</span>
        <h1 className="text-3xl md:text-5xl tracking-tight">Conditions générales de vente</h1>
        <p className="lead">
          Cadre contractuel des prestations de production audiovisuelle et d’accompagnement proposées par XKSPROD.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card glass p-6 md:p-8 stack-sm text-white/80">
            <h2 className="text-xl text-white">Commande & exécution</h2>
            <p>Chaque mission démarre après validation du devis, du périmètre et du planning.</p>
            <p>Les livrables sont définis contractuellement avant production.</p>
          </article>
          <article className="card glass p-6 md:p-8 stack-sm text-white/80">
            <h2 className="text-xl text-white">Règlement & droits</h2>
            <p>Conditions de paiement, cession de droits et clauses d’exploitation fixées dans la proposition signée.</p>
            <p>Des ajustements peuvent s’appliquer selon la complexité de production.</p>
          </article>
        </div>
        <div className="card glass p-6 md:p-8 stack-sm text-white/75">
          <h2 className="text-xl text-white">Contact administratif</h2>
          <p>Pour toute question contractuelle ou juridique: hello@xksprod.com</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/mentions-legales" className="btn-ghost inline-flex rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em]">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="btn-ghost inline-flex rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em]">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
