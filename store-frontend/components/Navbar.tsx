'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const primaryLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentPath = useMemo(() => pathname ?? '/', [pathname]);

  const handleToggle = () => {
    setIsMenuOpen((open) => !open);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 text-black backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.3em] transition hover:text-black/70 sm:text-base"
        >
          Belhos Accessories
        </Link>

        <button
          type="button"
          aria-label="Basculer la navigation"
          aria-expanded={isMenuOpen}
          onClick={handleToggle}
          className="inline-flex items-center justify-center rounded-full border border-black/20 px-4 py-2 text-[0.6rem] uppercase tracking-[0.35em] transition hover:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:hidden"
        >
          {isMenuOpen ? 'Fermer' : 'Menu'}
        </button>

        <nav className="hidden items-center gap-8 text-[0.7rem] uppercase tracking-[0.35em] text-black/80 lg:flex">
          {primaryLinks.map((link) => {
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

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/reservations"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] transition hover:bg-black hover:text-white"
          >
            Sur rendez-vous
          </Link>

          {user ? (
            <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em]">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full border border-black px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] transition hover:bg-black hover:text-white"
                >
                  Espace admin
                </Link>
              )}
              <span className="text-black/60">Bonjour, {user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/80"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em]">
              <Link href="/login" className="transition hover:text-black/60">
                Connexion
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/80"
              >
                S&apos;inscrire
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-black/10 bg-white/95 lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs uppercase tracking-[0.3em] text-black/80 sm:px-6">
            {primaryLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition ${isActive ? 'text-black' : 'hover:text-black'}`}
                  onClick={handleCloseMenu}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-black/10 px-4 py-4 text-xs uppercase tracking-[0.3em] text-black sm:px-6">
            <Link
              href="/reservations"
              className="inline-flex items-center justify-center rounded-full border border-black px-4 py-2 font-semibold transition hover:bg-black hover:text-white"
              onClick={handleCloseMenu}
            >
              Sur rendez-vous
            </Link>
            {user ? (
              <div className="flex flex-col gap-3 text-black/80">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center rounded-full border border-black px-4 py-2 font-semibold transition hover:bg-black hover:text-white"
                    onClick={handleCloseMenu}
                  >
                    Espace admin
                  </Link>
                )}
                <span className="text-black/60">Bonjour, {user.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseMenu();
                    logout();
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 font-semibold text-white transition hover:bg-black/80"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-black/80">
                <Link
                  href="/login"
                  className="transition hover:text-black"
                  onClick={handleCloseMenu}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 font-semibold text-white transition hover:bg-black/80"
                  onClick={handleCloseMenu}
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
