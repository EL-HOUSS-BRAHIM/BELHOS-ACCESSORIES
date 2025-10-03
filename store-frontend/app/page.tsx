import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              BELHOS ACCESSORIES
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Découvrez notre collection exclusive d&apos;accessoires de luxe
            </p>
            <Link
              href="/articles"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
            >
              Découvrir
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Produits en vedette
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Montres de luxe</h3>
              <p className="text-gray-600">Collection exclusive</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Bijoux</h3>
              <p className="text-gray-600">Pièces uniques</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Accessoires</h3>
              <p className="text-gray-600">Style et élégance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à faire votre réservation?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Réservez vos articles préférés dès maintenant
          </p>
          <Link
            href="/reservations"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
