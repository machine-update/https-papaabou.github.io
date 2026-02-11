import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { ContactForm } from '@/components/Contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | XKSPROD',
  description:
    'Parlez de votre projet avec XKSPROD. Brief, objectifs, budget et timeline: notre équipe vous répond sous 24-48h.',
}

const highlights = [
  {
    title: 'Réponse rapide',
    text: 'Un retour structuré sous 24 à 48h.',
  },
  {
    title: 'Cadrage précis',
    text: 'Objectifs, livrables, planning et budget clarifiés dès le départ.',
  },
  {
    title: 'Accompagnement complet',
    text: 'De la direction créative à la livraison finale.',
  },
]

export default function ContactPage() {
  return (
    <main className="bg-cinema text-white pt-20 md:pt-24 pb-20 md:pb-28">
      <section className="container">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] items-start">
          <aside className="contact-side-panel p-6 md:p-8 grid gap-6 relative overflow-hidden">
            <div className="absolute inset-0 cta-panel-noise pointer-events-none" />
            <div className="absolute -top-20 -left-12 w-64 h-64 cta-orb pointer-events-none" />
            <div className="relative z-10 stack-lg">
              <span className="eyebrow">Contact studio</span>
              <h1 className="text-3xl md:text-5xl tracking-tight">Construisons un projet qui marque.</h1>
              <p className="lead">
                Décrivez ce que vous voulez créer, ce que vous attendez du résultat, et votre échéance.
              </p>
            </div>

            <div className="relative z-10 grid gap-3">
              {highlights.map((item) => (
                <article key={item.title} className="list-item">
                  <div className="bullet-gold" />
                  <div>
                    <h2 className="text-lg">{item.title}</h2>
                    <p className="text-white/70">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="relative z-10 grid gap-2 text-sm text-white/75">
              <a href="mailto:contact@xksprod.com" className="hover:text-xks-gold transition-colors">
                contact@xksprod.com
              </a>
              <a href="tel:+33134258659" className="hover:text-xks-gold transition-colors">
                +33 1 34 25 86 59
              </a>
              <div className="pt-2">
                <Link href="/posts" className="text-white/80 hover:text-xks-gold transition-colors">
                  Voir des productions récentes
                </Link>
              </div>
            </div>
          </aside>

          <ContactForm />
        </div>
      </section>
    </main>
  )
}
