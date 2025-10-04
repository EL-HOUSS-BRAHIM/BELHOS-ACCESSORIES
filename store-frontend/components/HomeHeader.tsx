'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';

export type HomeNavLink = {
  href: string;
  label: string;
};

interface HomeHeaderProps {
  links: HomeNavLink[];
  activePath?: string;
}

export function HomeHeader({ links, activePath }: HomeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = useMemo(() => activePath ?? pathname ?? '/', [activePath, pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:text-black/70 sm:text-base"
        >
          Belhos Accessories
        </Link>

        <button
          type="button"
          aria-label="Basculer la navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-full border border-black/20 p-2 text-xs uppercase tracking-[0.3em] text-black transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:hidden"
        >
          {isMenuOpen ? 'Fermer' : 'Menu'}
        </button>

        <nav className="hidden items-center gap-8 text-[0.7rem] uppercase tracking-[0.35em] text-black/80 lg:flex">
          {links.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`transition ${isActive ? 'text-black' : 'hover:text-black'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/reservations"
          className="hidden items-center justify-center rounded-full border border-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white lg:inline-flex"
        >
          Sur rendez-vous
        </Link>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-black/10 bg-white lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs uppercase tracking-[0.3em] text-black/80 sm:px-6">
            {links.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition ${isActive ? 'text-black' : 'hover:text-black'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/reservations"
              className="mt-2 inline-flex items-center justify-center rounded-full border border-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Sur rendez-vous
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
