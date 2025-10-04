import Image from 'next/image';
import Link from 'next/link';

export const curatedCollections = [
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

interface CuratedCollectionsSectionProps {
  showCta?: boolean;
}

export function CuratedCollectionsSection({ showCta = true }: CuratedCollectionsSectionProps) {
  return (
    <section className="space-y-10">
      <div className="space-y-4 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Collections signatures</p>
        <h2 className="text-3xl font-semibold tracking-[0.15em]">Curations en édition limitée</h2>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-black/70">
          L’essence de Belhos réside dans l’alliance entre savoir-faire marocain et allure contemporaine. Explorez une sélection
          de pièces destinées aux collectionneurs d’objets singuliers.
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
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">{collection.priceRange}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-[0.15em]">{collection.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-black/70">{collection.description}</p>
              {showCta && (
                <Link
                  href="/boutique"
                  className="mt-auto inline-flex items-center text-[0.65rem] uppercase tracking-[0.25em] text-black transition hover:text-black/60"
                >
                  Voir les détails
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
