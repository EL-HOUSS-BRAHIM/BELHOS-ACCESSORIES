'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HomeHeader, HomeNavLink } from './HomeHeader';
import { SiteFooter } from './SiteFooter';

export const STORE_NAV_LINKS: HomeNavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/articles', label: 'Articles' },
  { href: '/reservations', label: 'Réservations' },
  { href: '/contact', label: 'Contact' },
];

interface StorefrontLayoutProps {
  children: ReactNode;
  activePath?: string;
}

export function StorefrontLayout({ children, activePath }: StorefrontLayoutProps) {
  const pathname = usePathname();
  const currentPath = useMemo(() => activePath ?? pathname ?? '/', [activePath, pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <HomeHeader links={STORE_NAV_LINKS} activePath={currentPath} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-16 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
