import Link from 'next/link';

const footerLinks = [
  {
    title: 'Maison',
    items: [
      { href: '/boutique', label: 'Boutique' },
      { href: '/collections', label: 'Collections' },
      { href: '/articles', label: 'Journal' },
    ],
  },
  {
    title: 'Services',
    items: [
      { href: '/reservations', label: 'Rendez-vous' },
      { href: '/contact', label: 'Contact' },
      { href: '/login', label: 'Espace client' },
    ],
  },
];

const socialLinks = [
  { href: 'https://www.instagram.com', label: 'Instagram' },
  { href: 'https://www.pinterest.com', label: 'Pinterest' },
  { href: 'https://www.facebook.com', label: 'Facebook' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-black">Belhos Accessories</p>
            <p className="max-w-md text-sm leading-relaxed text-black/70">
              Des accessoires pensés au Maroc et conçus pour durer. Nous sélectionnons des matières nobles et des artisans
              passionnés pour imaginer des pièces à porter et à transmettre.
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-black/60">
              {socialLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-black" target="_blank" rel="noreferrer">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/60">{section.title}</p>
                <ul className="space-y-2 text-sm text-black/80">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="transition hover:text-black">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-black/10 pt-6 text-xs text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Belhos Accessories. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4 uppercase tracking-[0.3em]">
            <Link href="/mentions-legales" className="transition hover:text-black">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="transition hover:text-black">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
