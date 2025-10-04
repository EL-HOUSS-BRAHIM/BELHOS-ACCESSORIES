import StorefrontLayout from '@/components/StorefrontLayout';

export default function PolitiqueConfidentialitePage() {
  return (
    <StorefrontLayout activePath="/politique-de-confidentialite">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-center text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
          Politique de confidentialité
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-black/70 sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Introduction</h2>
            <p>
              Cette politique de confidentialité explique comment Belhos Accessories collecte, utilise et protège vos données
              personnelles lorsque vous visitez notre site ou utilisez nos services. Ce texte est fourni à titre indicatif et
              sera mis à jour avec les informations définitives.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Données collectées</h2>
            <p>
              Nous pouvons collecter des informations telles que votre nom, votre adresse email, votre adresse postale et votre
              historique d&apos;achats afin d&apos;améliorer votre expérience client. Des données supplémentaires pourront être précisées
              ultérieurement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Utilisation des données</h2>
            <p>
              Les informations recueillies sont utilisées pour traiter vos commandes, personnaliser vos interactions avec notre
              boutique et vous envoyer des communications pertinentes. Nous n&apos;utiliserons jamais vos données à d&apos;autres fins sans
              votre consentement explicite.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Partage des données</h2>
            <p>
              Vos informations personnelles ne sont partagées qu&apos;avec des partenaires de confiance qui respectent nos standards de
              sécurité et uniquement lorsque cela est nécessaire à la fourniture du service. Aucun partage commercial n&apos;est
              effectué sans votre accord.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-[0.15em] text-black sm:text-2xl">Vos droits</h2>
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Pour exercer ces
              droits, contactez-nous à l&apos;adresse suivante : privacy@belhos-accessories.com.
            </p>
          </section>
        </div>
      </div>
    </StorefrontLayout>
  );
}
