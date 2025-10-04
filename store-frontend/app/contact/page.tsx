'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/reservations', label: 'Réservations' },
  { href: '/contact', label: 'Contact' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[0.7rem] uppercase tracking-[0.35em] sm:px-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.45em]">
            Belhos Accessories
          </Link>
          <div className="flex flex-wrap justify-center gap-6 text-[0.65rem] font-medium md:text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  link.href === '/contact' ? 'text-black' : 'hover:text-black/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/reservations"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
          >
            Mes réservations
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 space-y-8 text-center">
          <span className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white">
            Restons en contact
          </span>
          <h1 className="text-4xl font-semibold tracking-[0.2em] sm:text-5xl">
            Contactez-nous
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
            Notre équipe est à votre écoute pour répondre à toutes vos questions.
            N&apos;hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
          </p>
        </section>

        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Information - Left Side */}
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-6">
              {/* Address */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                  Adresse
                </h3>
                <p className="text-sm leading-relaxed text-black/70">
                  123 Rue de la Mode<br />
                  Casablanca, Maroc
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                  Téléphone
                </h3>
                <p className="text-sm leading-relaxed text-black/70">
                  +212 5 22 12 34 56
                </p>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                  Email
                </h3>
                <p className="text-sm leading-relaxed text-black/70">
                  contact@belhos.ma
                </p>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                  Horaires
                </h3>
                <div className="space-y-1 text-sm leading-relaxed text-black/70">
                  <p>Lundi - Vendredi: 9h - 18h</p>
                  <p>Samedi: 10h - 16h</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm sm:p-12">
              <h2 className="mb-2 text-2xl font-semibold tracking-[0.2em]">
                Envoyez-nous un message
              </h2>
              <p className="mb-8 text-sm text-black/60">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </p>

              {/* Success Message */}
              {submitted && (
                <div className="mb-6 rounded-2xl border border-black/10 bg-black p-4 text-center">
                  <div className="mb-2 flex justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white">
                    Message envoyé avec succès !
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full rounded-3xl border border-black/20 bg-white px-6 py-4 text-sm focus:border-black focus:outline-none"
                    placeholder="Écrivez votre message ici..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-black px-8 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-black/80 disabled:bg-black/50"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional CTA Section */}
        <section className="mt-24 rounded-3xl border border-black/10 bg-white p-12 text-center shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold tracking-[0.2em]">
            Besoin d&apos;une réservation ?
          </h2>
          <p className="mb-8 text-sm text-black/60">
            Consultez notre collection et réservez vos accessoires préférés en ligne
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/boutique"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-black/80"
            >
              Voir la boutique
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
            >
              Nos collections
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
