import Image from 'next/image';
import Link from 'next/link';
import { CuratedCollectionsSection, curatedCollections } from '@/components/CuratedCollections';
import { HomeHeader, type HomeNavLink } from '@/components/HomeHeader';
import { SiteFooter } from '@/components/SiteFooter';

const navLinks: HomeNavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/contact', label: 'Contact' },
];

export default function CollectionsPage() {
  const highlight = curatedCollections[0];

  return (
    <div className="min-h-screen bg-white text-black">
      <HomeHeader links={navLinks} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-20 sm:gap-20 sm:px-6 lg:gap-24 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white">
              Sélection signature
            </span>
            <h1 className="text-3xl font-semibold tracking-[0.15em] sm:text-4xl lg:text-5xl">
              Collections exclusives Belhos
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
              Chaque collection est imaginée autour d’une histoire, d’une matière et d’un geste artisanal. Découvrez nos pièces en édition limitée, pensées pour accompagner vos instants les plus précieux.
            </p>
            <div className="flex flex-wrap gap-4 text-[0.65rem] uppercase tracking-[0.25em]">
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-black/80"
              >
                Accéder à la boutique
              </Link>
              <Link
                href="/reservations"
                className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 font-semibold transition hover:bg-black hover:text-white"
              >
                Planifier une visite
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-4 shadow-lg shadow-black/5">
              <div className="relative h-72 w-full overflow-hidden rounded-[24px] sm:h-[22rem]">
                <Image
                  src={highlight.image}
                  alt={highlight.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {curatedCollections.slice(1).map((collection) => (
                <div key={collection.title} className="rounded-2xl border border-black/10 bg-white p-5 text-sm shadow-sm">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">{collection.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-black/60">{collection.priceRange}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CuratedCollectionsSection />

        <section className="rounded-[32px] border border-black/10 bg-neutral-50 px-6 py-10 shadow-inner sm:px-10">
          <div className="space-y-4 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Expérience personnalisée</p>
            <h2 className="text-3xl font-semibold tracking-[0.15em]">Composez votre propre sélection</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-black/70">
              Nos conseillers vous accompagnent pour créer une curation unique en fonction de vos envies. Réservez un créneau pour découvrir nos pièces en privé et accéder aux éditions à venir.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-[0.65rem] uppercase tracking-[0.25em]">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 font-semibold transition hover:bg-black hover:text-white"
            >
              Contacter un conseiller
            </Link>
            <Link
              href="/boutique"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-black/80"
            >
              Explorer la boutique
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
