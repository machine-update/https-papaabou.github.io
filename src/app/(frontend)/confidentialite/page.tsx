import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | XKSPROD',
  description: 'Politique de confidentialité du site XKSPROD.',
}

export default function ConfidentialitePage() {
  return (
    <main className="bg-cinema text-white section-space">
      <div className="container max-w-4xl stack-lg">
        <span className="eyebrow">Juridique</span>
        <h1 className="text-3xl md:text-5xl tracking-tight">Politique de confidentialité</h1>
        <p className="lead">
          XKSPROD applique un traitement responsable des données transmises via ses formulaires et canaux de contact.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card glass p-6 md:p-8 stack-sm text-white/80">
            <h2 className="text-xl text-white">Collecte & usage</h2>
            <p>
              Les données fournies servent exclusivement à l’analyse des besoins, au suivi commercial et à la réponse
              opérationnelle.
            </p>
            <p>Aucune donnée n’est exploitée hors du cadre de la relation professionnelle engagée.</p>
          </article>
          <article className="card glass p-6 md:p-8 stack-sm text-white/80">
            <h2 className="text-xl text-white">Droits utilisateurs</h2>
            <p>Vous pouvez demander l’accès, la rectification ou la suppression de vos informations.</p>
            <p>Demande: hello@xksprod.com</p>
          </article>
        </div>
        <div className="card glass p-6 md:p-8 stack-sm text-white/75">
          <h2 className="text-xl text-white">Sécurité</h2>
          <p>
            Des mesures techniques et organisationnelles adaptées protègent la confidentialité, l’intégrité et
            la disponibilité des données.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/mentions-legales" className="btn-ghost inline-flex rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em]">
              Mentions légales
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
