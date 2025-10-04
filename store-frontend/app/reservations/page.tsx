'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface Reservation {
  id: number;
  quantity: number;
  status: string;
  createdAt: string;
  product: Product;
}

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/reservations', label: 'Réservations' },
  { href: '/contact', label: 'Contact' },
];

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
};

function ReservationsContent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
    
    // Check if there's a productId in URL params
    const productId = searchParams.get('productId');
    if (productId) {
      setSelectedProduct(productId);
    }
  }, [user, router, searchParams]);

  const fetchData = async () => {
    try {
      const [productsRes, reservationsRes] = await Promise.all([
        api.get('/products'),
        api.get('/reservations/my-reservations'),
      ]);
      setProducts(productsRes.data);
      setReservations(reservationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await api.post('/reservations', {
        productId: parseInt(selectedProduct),
        quantity: parseInt(quantity.toString()),
      });
      setSuccess('Réservation créée avec succès!');
      setSelectedProduct('');
      setQuantity(1);
      fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      setSuccess('Réservation annulée avec succès!');
      fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de l\'annulation');
    }
  };

  const getSelectedProductDetails = () => {
    return products.find(p => p.id === parseInt(selectedProduct));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[0.7rem] uppercase tracking-[0.35em] sm:px-6 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="text-sm font-semibold tracking-[0.45em]">
              Belhos Accessories
            </Link>
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
          </nav>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
            <p className="text-sm uppercase tracking-[0.35em] text-black/60">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[0.7rem] uppercase tracking-[0.35em] sm:px-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.45em]">
            Belhos Accessories
          </Link>
          <div className="flex flex-wrap justify-center gap-6 text-[0.65rem] font-medium md:text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  link.href === '/reservations' ? 'text-black' : 'hover:text-black/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/boutique"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
          >
            Retour à la boutique
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 space-y-8 text-center">
          <span className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white">
            Espace Personnel
          </span>
          <h1 className="text-4xl font-semibold tracking-[0.2em] sm:text-5xl">
            Mes Réservations
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
            Gérez vos réservations et créez-en de nouvelles pour vos articles préférés
          </p>
        </section>

        {/* Alert Messages */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 rounded-2xl border border-black/10 bg-black p-4 text-center">
            <div className="mb-2 flex justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white">
              {success}
            </p>
          </div>
        )}

        {/* Create New Reservation */}
        <section className="mb-16">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm sm:p-12">
            <h2 className="mb-2 text-2xl font-semibold tracking-[0.2em]">
              Nouvelle Réservation
            </h2>
            <p className="mb-8 text-sm text-black/60">
              Sélectionnez un produit et la quantité souhaitée
            </p>

            <form onSubmit={handleCreateReservation} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Product Selection */}
                <div>
                  <label className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                    Produit
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                    required
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.filter(p => p.stock > 0).map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price.toFixed(2)} MAD (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={getSelectedProductDetails()?.stock || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Product Preview */}
              {selectedProduct && getSelectedProductDetails() && (
                <div className="rounded-2xl border border-black/10 bg-gray-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                      <Image
                        src={getSelectedProductDetails()!.imageUrl}
                        alt={getSelectedProductDetails()!.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold tracking-[0.15em]">
                        {getSelectedProductDetails()!.name}
                      </h3>
                      <p className="text-sm text-black/60">
                        Prix unitaire: {getSelectedProductDetails()!.price.toFixed(2)} MAD
                      </p>
                      <p className="text-sm font-semibold">
                        Total: {(getSelectedProductDetails()!.price * quantity).toFixed(2)} MAD
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedProduct}
                className="w-full rounded-full bg-black px-8 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-black/80 disabled:bg-black/30"
              >
                {isSubmitting ? 'Réservation en cours...' : 'Créer la réservation'}
              </button>
            </form>
          </div>
        </section>

        {/* Reservations List */}
        <section>
          <h2 className="mb-8 text-2xl font-semibold tracking-[0.2em]">
            Réservations Actives
          </h2>

          {reservations.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-12 text-center shadow-sm">
              <div className="mb-6 text-4xl text-black/20">📋</div>
              <h3 className="mb-3 text-xl font-semibold tracking-[0.2em]">
                Aucune réservation
              </h3>
              <p className="mb-8 text-sm text-black/60">
                Vous n&apos;avez pas encore de réservations actives
              </p>
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-black/80"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reservations.map((reservation) => (
                <article
                  key={reservation.id}
                  className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:shadow-lg"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={reservation.product.imageUrl}
                      alt={reservation.product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {/* Status Badge */}
                    <div className="absolute right-4 top-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] backdrop-blur ${
                          reservation.status === 'pending'
                            ? 'bg-yellow-500/90 text-white'
                            : reservation.status === 'confirmed'
                            ? 'bg-green-500/90 text-white'
                            : reservation.status === 'cancelled'
                            ? 'bg-red-500/90 text-white'
                            : 'bg-black/90 text-white'
                        }`}
                      >
                        {statusLabels[reservation.status] || reservation.status}
                      </span>
                    </div>
                  </div>

                  {/* Reservation Details */}
                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="mb-2 text-base font-semibold tracking-[0.15em]">
                        {reservation.product.name}
                      </h3>
                      <div className="space-y-1 text-xs text-black/60">
                        <p>Quantité: {reservation.quantity} pièce{reservation.quantity > 1 ? 's' : ''}</p>
                        <p>Prix unitaire: {reservation.product.price.toFixed(2)} MAD</p>
                      </div>
                    </div>

                    <div className="border-t border-black/10 pt-4">
                      <div className="mb-4 flex items-baseline justify-between">
                        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-black/50">
                          Total
                        </span>
                        <span className="text-lg font-semibold">
                          {(reservation.product.price * reservation.quantity).toFixed(2)} MAD
                        </span>
                      </div>

                      {/* Cancel Button */}
                      {reservation.status === 'pending' && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="w-full rounded-full border border-red-500 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          Annuler la réservation
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-24 rounded-3xl border border-black/10 bg-white p-12 text-center shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold tracking-[0.2em]">
            Besoin d&apos;aide ?
          </h2>
          <p className="mb-8 text-sm text-black/60">
            Notre équipe est disponible pour vous accompagner dans vos réservations
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
          >
            Nous contacter
          </Link>
        </section>
      </main>
    </div>
  );
}

export default function ReservationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-black">
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[0.7rem] uppercase tracking-[0.35em] sm:px-6 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="text-sm font-semibold tracking-[0.45em]">
              Belhos Accessories
            </Link>
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
          </nav>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
            <p className="text-sm uppercase tracking-[0.35em] text-black/60">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <ReservationsContent />
    </Suspense>
  );
}
