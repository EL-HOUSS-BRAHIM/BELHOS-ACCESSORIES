import Image from 'next/image';
import Link from 'next/link';
import { CuratedCollectionsSection } from '@/components/CuratedCollections';
import { HomeHeader, type HomeNavLink } from '@/components/HomeHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { HotProductsCarousel } from '@/components/HotProductsCarousel';

const navLinks: HomeNavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/contact', label: 'Contact' },
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
      <HomeHeader links={navLinks} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-20 sm:gap-20 sm:px-6 lg:gap-24 lg:px-8">
        <HotProductsCarousel />

        <div id="collections">
          <CuratedCollectionsSection />
        </div>

        <section className="rounded-[32px] border border-black/10 bg-neutral-50 px-6 py-10 shadow-inner sm:px-10">
          <div className="space-y-4 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Nouveautés</p>
            <h2 className="text-3xl font-semibold tracking-[0.15em]">Sélection fraîchement arrivée</h2>
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
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">{item.materials}</p>
                  <h3 className="text-lg font-semibold tracking-[0.15em]">{item.name}</h3>
                  <span className="mt-auto text-sm font-semibold">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Carnet Belhos</p>
            <h2 className="text-3xl font-semibold tracking-[0.15em]">Histoires et inspirations</h2>
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
                    <h3 className="text-lg font-semibold tracking-[0.15em]">{story.title}</h3>
                    <p className="text-sm leading-relaxed text-black/70">{story.excerpt}</p>
                    <Link
                      href="/boutique"
                      className="inline-flex items-center text-[0.65rem] uppercase tracking-[0.25em] text-black transition hover:text-black/60"
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
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Avis clients</p>
              <h3 className="text-2xl font-semibold tracking-[0.15em]">Ils nous font confiance</h3>
            </div>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="space-y-3 rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-sm">
                  <blockquote className="text-sm leading-relaxed text-black/70">“{testimonial.quote}”</blockquote>
                  <figcaption className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">
                    {testimonial.name} · {testimonial.title}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border border-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.25em] transition hover:bg-black hover:text-white"
            >
              Prendre contact
            </Link>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-black px-6 py-12 text-center text-white shadow-lg shadow-black/10 sm:px-12">
          <div className="space-y-6">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/70">Invitation privée</p>
            <h2 className="text-3xl font-semibold tracking-[0.15em]">Visitez notre showroom</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80">
              Nos conseillers vous accueillent sur rendez-vous pour créer la pièce qui racontera votre histoire. Un rituel personnalisé autour d’une sélection d’accessoires exclusifs et de matériaux nobles.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[0.65rem] uppercase tracking-[0.25em]">
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

      <SiteFooter />
    </div>
  );
}
