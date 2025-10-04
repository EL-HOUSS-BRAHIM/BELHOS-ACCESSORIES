import type { ReactNode } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/reservations', label: 'Réservations' },
  { href: '/contact', label: 'Contact' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-de-confidentialite', label: 'Confidentialité' },
];

interface StorefrontLayoutProps {
  children: ReactNode;
  activePath?: string;
}

export function StorefrontLayout({ children, activePath }: StorefrontLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-[0.65rem] uppercase tracking-[0.3em] text-black/70 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.35em] text-black transition hover:text-black/70"
          >
            Belhos Accessories
          </Link>

          <nav className="flex flex-wrap justify-center gap-5 text-[0.6rem] uppercase tracking-[0.3em] md:text-[0.65rem]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-black ${
                  activePath === link.href ? 'text-black' : 'text-black/60'
                }`}
                aria-current={activePath === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/reservations"
            className="inline-flex items-center justify-center rounded-full border border-black px-6 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
          >
            Sur rendez-vous
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}

export default StorefrontLayout;
