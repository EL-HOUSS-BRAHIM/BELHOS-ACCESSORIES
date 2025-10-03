import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/contact', label: 'Contact' },
];

const curatedCollections = [
  {
    title: 'Collection Éclipse',
    description:
      'Bijoux minimalistes en or blanc et diamants cultivés, inspirés des nuits scintillantes de Marrakech.',
    image:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
    priceRange: 'À partir de 480 MAD',
  },
  {
    title: 'Signature Atlas',
    description:
      'Montres en acier brossé et bracelets en cuir italien, réalisées en éditions numérotées.',
    image:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
    priceRange: 'À partir de 1 250 MAD',
  },
  {
    title: 'Verre Lumière',
    description:
      'Accessoires en cristal et verre soufflé pour illuminer vos tables et vos intérieurs.',
    image:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80',
    priceRange: 'À partir de 320 MAD',
  },
];

const newArrivals = [
  {
    name: 'Montre Saphir Nuit',
    price: '1 480 MAD',
    materials: 'Acier bleu nuit & cuir nubuck',
    image:
      'https://images.unsplash.com/photo-1519408469771-2586093c3f14?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Bracelet Céleste',
    price: '640 MAD',
    materials: 'Argent martelé & spinelle noir',
    image:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Sac Soir Opaline',
    price: '980 MAD',
    materials: 'Cuir grainé & finition palladium',
    image:
      'https://images.unsplash.com/photo-1612810806695-30ba0b38fa13?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Lunettes Horizon',
    price: '560 MAD',
    materials: 'Acétate fumé & détails dorés',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
  },
];

const editorialStories = [
  {
    title: 'Voyage dans les ateliers marocains',
    excerpt:
      'Rencontrez les artisans qui façonnent nos pièces signature avec précision et passion.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'L’art de superposer les bijoux',
    excerpt:
      'Jouez avec les volumes, les textures et les teintes pour créer un look lumineux et moderne.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
  },
];

const testimonials = [
  {
    name: 'Sofia R.',
    title: 'Architecte d’intérieur',
    quote:
      'Chaque commande est un plaisir : les finitions sont impeccables et le service personnalisé sublime l’expérience.',
  },
  {
    name: 'Youssef L.',
    title: 'Entrepreneur',
    quote:
      'Des accessoires raffinés qui complètent mes looks professionnels tout en restant audacieux.',
  },
  {
    name: 'Leïla A.',
    title: 'Styliste',
    quote:
      'Les collections Belhos offrent une palette unique pour créer des silhouettes luxueuses au quotidien.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[0.7rem] uppercase tracking-[0.35em] sm:px-6 md:flex-row md:items-center md:justify-between">
          <span className="text-sm font-semibold tracking-[0.45em]">Belhos Accessories</span>
          <div className="flex flex-wrap justify-center gap-6 text-[0.65rem] font-medium md:text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-black/60"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/reservations"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
          >
            Sur rendez-vous
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white">
              Nouvelle Collection 2024
            </span>
            <h1 className="text-4xl font-semibold tracking-[0.2em] sm:text-5xl">Intemporel & Lumineux</h1>
            <p className="max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
              Des silhouettes sobres, sculptées dans des matières nobles, pensées pour souligner chaque instant de votre journée.
              Notre équipe sélectionne des pièces raffinées qui dialoguent avec la lumière et la texture.
            </p>
            <div className="flex flex-wrap gap-4 text-[0.65rem] uppercase tracking-[0.35em]">
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-black/80"
              >
                Découvrir la boutique
              </Link>
              <Link
                href="#collections"
                className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 font-semibold transition hover:bg-black hover:text-white"
              >
                Explorer les collections
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">Pièces sur mesure</p>
                <p className="mt-3 text-xl font-semibold">48h</p>
                <p className="mt-1 text-xs text-black/60">Délai de conception</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">Ateliers privés</p>
                <p className="mt-3 text-xl font-semibold">2 villes</p>
                <p className="mt-1 text-xs text-black/60">Casablanca & Rabat</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">Clients fidèles</p>
                <p className="mt-3 text-xl font-semibold">8k+</p>
                <p className="mt-1 text-xs text-black/60">Depuis 2012</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[40px] border border-black/10 bg-white p-4 shadow-lg shadow-black/5">
              <div className="relative h-80 w-full overflow-hidden rounded-[28px] sm:h-[22rem]">
                <Image
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
                  alt="Montre et accessoires Belhos"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {curatedCollections.slice(0, 2).map((collection) => (
                <div key={collection.title} className="rounded-2xl border border-black/10 bg-white p-5 text-sm shadow-sm">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">{collection.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-black/60">{collection.priceRange}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="collections" className="space-y-10">
          <div className="space-y-4 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">Collections signatures</p>
            <h2 className="text-3xl font-semibold tracking-[0.2em]">Curations en édition limitée</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-black/70">
              L’essence de Belhos réside dans l’alliance entre savoir-faire marocain et allure contemporaine. Explorez une sélection de pièces destinées aux collectionneurs d’objets singuliers.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {curatedCollections.map((collection) => (
              <article
                key={collection.title}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg shadow-black/5 transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-8">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">{collection.priceRange}</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[0.2em]">{collection.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-black/70">{collection.description}</p>
                  <Link
                    href="/boutique"
                    className="mt-auto inline-flex items-center text-[0.65rem] uppercase tracking-[0.35em] text-black transition hover:text-black/60"
                  >
                    Voir les détails
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-black/10 bg-neutral-50 px-6 py-10 shadow-inner sm:px-10">
          <div className="space-y-4 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">Nouveautés</p>
            <h2 className="text-3xl font-semibold tracking-[0.2em]">Sélection fraîchement arrivée</h2>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {newArrivals.map((item) => (
              <div
                key={item.name}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-md shadow-black/5"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">{item.materials}</p>
                  <h3 className="text-lg font-semibold tracking-[0.2em]">{item.name}</h3>
                  <span className="mt-auto text-sm font-semibold">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">Carnet Belhos</p>
            <h2 className="text-3xl font-semibold tracking-[0.2em]">Histoires et inspirations</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-black/70">
              Découvrez l’univers de nos artisans et les secrets de fabrication de vos pièces favorites. Reportages, conseils de style et rencontres exclusives rythment notre journal.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {editorialStories.map((story) => (
                <article
                  key={story.title}
                  className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-md shadow-black/5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-3 p-6">
                    <h3 className="text-lg font-semibold tracking-[0.2em]">{story.title}</h3>
                    <p className="text-sm leading-relaxed text-black/70">{story.excerpt}</p>
                    <Link
                      href="/articles"
                      className="inline-flex items-center text-[0.65rem] uppercase tracking-[0.35em] text-black transition hover:text-black/60"
                    >
                      Lire l’article
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-8 rounded-[32px] border border-black/10 bg-neutral-50 p-8 shadow-inner">
            <div className="space-y-4 text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">Avis clients</p>
              <h3 className="text-2xl font-semibold tracking-[0.2em]">Ils nous font confiance</h3>
            </div>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="space-y-3 rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-sm">
                  <blockquote className="text-sm leading-relaxed text-black/70">“{testimonial.quote}”</blockquote>
                  <figcaption className="text-[0.65rem] uppercase tracking-[0.35em] text-black/60">
                    {testimonial.name} · {testimonial.title}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border border-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
            >
              Prendre contact
            </Link>
          </div>
        </section>

        <section className="rounded-[40px] border border-black/10 bg-black px-6 py-12 text-center text-white shadow-lg shadow-black/10 sm:px-12">
          <div className="space-y-6">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/70">Invitation privée</p>
            <h2 className="text-3xl font-semibold tracking-[0.2em]">Visitez notre showroom</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80">
              Nos conseillers vous accueillent sur rendez-vous pour créer la pièce qui racontera votre histoire. Un rituel personnalisé autour d’une sélection d’accessoires exclusifs et de matériaux nobles.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[0.65rem] uppercase tracking-[0.35em]">
              <Link
                href="/reservations"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-white/80"
              >
                Réserver une visite
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Contacter un expert
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
