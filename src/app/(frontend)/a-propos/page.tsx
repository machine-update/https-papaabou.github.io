import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'A propos | XKSPROD',
  description: 'Présentation du studio XKSPROD et de son approche de production premium.',
}

const values = [
  {
    title: '12+ ans d’expérience',
    text: 'Plus d’une décennie de production d’artistes et de spectacles avec un niveau d’exigence constant.',
  },
  {
    title: 'Écoute & conseil',
    text: 'Nous prenons le temps d’aligner vos besoins, votre contexte et vos objectifs avant toute exécution.',
  },
  {
    title: 'Accompagnement sur-mesure',
    text: 'Quel que soit votre projet, nous construisons avec vous une réponse précise pour un événement unique.',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-cinema text-white section-space">
      <section className="container">
        <div className="grid gap-10 lg:grid-cols-[0.5fr_0.5fr] items-start">
          <div className="stack-lg">
            <span className="eyebrow">A propos</span>
            <h1 className="text-3xl md:text-5xl tracking-tight">Le studio derrière XKSPROD.</h1>
            <p className="lead">
              La société XKSPROD est spécialisée depuis plus de 12 ans dans la production d’artistes et de spectacles.
            </p>
            <p className="lead">
              XKSPROD réunit des professionnels ayant une grande expérience dans leur domaine, avec une
              caractéristique commune: être à votre écoute et répondre à vos besoins pour concevoir
              l’outil de communication qui vous correspond.
            </p>
            <p className="lead">
              Quel que soit votre projet, nous saurons vous conseiller et vous accompagner afin de
              réaliser ensemble un événement unique.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]"
              >
                Nous contacter
              </Link>
              <Link
                href="/posts"
                className="btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.22em]"
              >
                Voir les productions
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {values.map((item) => (
              <article key={item.title} className="card glass p-6">
                <h2 className="text-xl mb-2">{item.title}</h2>
                <p className="text-white/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
