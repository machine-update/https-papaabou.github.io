import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Mentions légales | XKSPROD',
  description: 'Mentions légales du site XKSPROD.',
}

export default function MentionsLegalesPage() {
  return (
    <main className="bg-cinema text-white section-space">
      <div className="container max-w-4xl stack-lg">
        <span className="eyebrow">Juridique</span>
        <h1 className="text-3xl md:text-5xl tracking-tight">Mentions légales</h1>
        <p className="lead">
          Informations légales relatives à l’édition, la responsabilité et l’hébergement du site XKSPROD.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card glass p-6 md:p-8 stack-md text-white/80">
            <h2 className="text-xl text-white">Éditeur</h2>
            <p>XKSPROD</p>
            <p>Contact: hello@xksprod.com</p>
            <p>Directeur de publication: XKSPROD</p>
          </article>
          <article className="card glass p-6 md:p-8 stack-md text-white/80">
            <h2 className="text-xl text-white">Hébergement</h2>
            <p>Infrastructure cloud sécurisée.</p>
            <p>Les informations détaillées d’hébergement peuvent être communiquées sur demande légale.</p>
          </article>
        </div>
        <div className="card glass p-6 md:p-8 stack-sm text-white/75">
          <h2 className="text-xl text-white">Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus (textes, visuels, éléments graphiques, marques) est protégé. Toute reproduction,
            distribution ou exploitation sans autorisation écrite préalable est interdite.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/confidentialite" className="btn-ghost inline-flex rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em]">
              Confidentialité
            </Link>
            <Link href="/cgv" className="btn-ghost inline-flex rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em]">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
