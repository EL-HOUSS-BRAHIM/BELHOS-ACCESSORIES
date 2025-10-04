export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Mentions légales</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Éditeur du site</h2>
          <p>
            Belhos Accessories<br />
            123 Rue de la Mode, 75000 Paris<br />
            contact@belhos-accessories.com<br />
            +33 1 23 45 67 89
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Directeur de publication</h2>
          <p>Nom du responsable – Directeur général.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Hébergement</h2>
          <p>
            Nom de l&apos;hébergeur<br />
            Adresse de l&apos;hébergeur<br />
            Téléphone : +33 1 98 76 54 32
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images, logos, etc.) sont la
            propriété de Belhos Accessories ou de ses partenaires. Toute reproduction, représentation,
            modification ou adaptation, totale ou partielle, est strictement interdite sans
            autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Responsabilité</h2>
          <p>
            Les informations communiquées sur ce site sont fournies à titre indicatif et peuvent être
            modifiées à tout moment. Belhos Accessories ne saurait être tenue responsable des dommages
            directs ou indirects résultant de l&apos;utilisation du site ou des informations qu&apos;il contient.
          </p>
        </section>
      </div>
    </div>
  );
}
