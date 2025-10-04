import { StorefrontLayout } from '@/components/StorefrontLayout';

export default function MentionsLegalesPage() {
  return (
    <StorefrontLayout activePath="/mentions-legales">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-center text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
          Mentions légales
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-black/70 sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Éditeur du site</h2>
            <p>
              Belhos Accessories
              <br />
              123 Rue de la Mode, 75000 Paris
              <br />
              contact@belhos-accessories.com
              <br />
              +33 1 23 45 67 89
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Directeur de publication</h2>
            <p>Nom du responsable – Directeur général.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Hébergement</h2>
            <p>
              Nom de l&apos;hébergeur
              <br />
              Adresse de l&apos;hébergeur
              <br />
              Téléphone : +33 1 98 76 54 32
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images, logos, etc.) sont la
              propriété de Belhos Accessories ou de ses partenaires. Toute reproduction, représentation,
              modification ou adaptation, totale ou partielle, est strictement interdite sans
              autorisation préalable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Responsabilité</h2>
            <p>
              Les informations communiquées sur ce site sont fournies à titre indicatif et peuvent être
              modifiées à tout moment. Belhos Accessories ne saurait être tenue responsable des dommages
              directs ou indirects résultant de l&apos;utilisation du site ou des informations qu&apos;il contient.
            </p>
          </section>
        </div>
      </div>
    </StorefrontLayout>
  );
}
