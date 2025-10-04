'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import type { Product, Reservation } from '@/lib/types';
import { parseProductList, parseReservationList } from '@/lib/normalizers';
import { useDataSource } from '@/lib/DataSourceContext';
import { mockProducts, mockReservations } from '@/lib/mockData';

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
  const { mode, isReady: isDataSourceReady } = useDataSource();

  const fetchData = useCallback(async () => {
    try {
      console.debug('[Reservations] Fetching data', { mode });
      setLoading(true);
      const [productsRes, reservationsRes] = await Promise.all([
        mode === 'mock' ? Promise.resolve({ data: mockProducts }) : api.get('/products'),
        mode === 'mock'
          ? Promise.resolve({ data: mockReservations })
          : api.get('/reservations/my-reservations'),
      ]);
      const normalizedProducts = parseProductList(productsRes.data);
      const normalizedReservations = parseReservationList(reservationsRes.data);

      setProducts(normalizedProducts);
      setReservations(normalizedReservations);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isDataSourceReady) {
      return;
    }

    fetchData();

    const productId = searchParams.get('productId');
    if (productId) {
      setSelectedProduct(productId);
    }
  }, [user, router, searchParams, fetchData, isDataSourceReady]);

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const normalizedQuantity = Number.parseInt(String(quantity), 10);

      if (mode === 'mock') {
        console.debug('[Reservations] Creating reservation in mock mode', {
          productId: selectedProduct,
          quantity: normalizedQuantity,
        });

        const quantityToReserve = Number.isNaN(normalizedQuantity) ? 1 : normalizedQuantity;
        const targetProduct = products.find((product) => product.id === selectedProduct);

        if (!targetProduct) {
          setError('Produit introuvable');
          return;
        }

        if (targetProduct.stock < quantityToReserve) {
          setError('Stock insuffisant pour cette réservation');
          return;
        }

        const newReservation: Reservation = {
          id: `mock-res-${Date.now()}`,
          quantity: quantityToReserve,
          status: 'pending',
          createdAt: new Date().toISOString(),
          product: {
            ...targetProduct,
            stock: targetProduct.stock - quantityToReserve,
          },
          ...(user
            ? {
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              }
            : {}),
        };

        setReservations((prev) => [newReservation, ...prev]);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === targetProduct.id
              ? { ...product, stock: Math.max(product.stock - quantityToReserve, 0) }
              : product,
          ),
        );
      } else {
        await api.post('/reservations', {
          productId: selectedProduct,
          quantity: Number.isNaN(normalizedQuantity) ? 1 : normalizedQuantity,
        });
      }
      setSuccess('Réservation créée avec succès!');
      setSelectedProduct('');
      setQuantity(1);
      if (mode !== 'mock') {
        fetchData();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) return;

    try {
      if (mode === 'mock') {
        console.debug('[Reservations] Cancelling reservation in mock mode', { id });
        let cancelledReservation: Reservation | undefined;
        setReservations((prev) => {
          cancelledReservation = prev.find((reservation) => reservation.id === id);
          return prev.filter((reservation) => reservation.id !== id);
        });

        if (cancelledReservation) {
          setProducts((prev) =>
            prev.map((product) =>
              product.id === cancelledReservation?.product.id
                ? { ...product, stock: product.stock + cancelledReservation.quantity }
                : product,
            ),
          );
        }
      } else {
        await api.delete(`/reservations/${id}`);
      }
      setSuccess('Réservation annulée avec succès!');
      if (mode !== 'mock') {
        fetchData();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de l\'annulation');
    }
  };

  const selectedProductDetails = products.find((product) => product.id === selectedProduct);

  if (loading) {
    return (
      <StorefrontLayout activePath="/reservations">
        <div className="flex flex-col items-center justify-center space-y-6 py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
          <p className="text-sm uppercase tracking-[0.35em] text-black/60">Chargement...</p>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout activePath="/reservations">
      <main>
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
                    {products.filter((p) => p.stock > 0).map((product) => (
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
                    max={selectedProductDetails?.stock || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Product Preview */}
              {selectedProduct && selectedProductDetails && (
                <div className="rounded-2xl border border-black/10 bg-gray-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                      <Image
                        src={selectedProductDetails.imageUrl}
                        alt={selectedProductDetails.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold tracking-[0.15em]">
                        {selectedProductDetails.name}
                      </h3>
                      <p className="text-sm text-black/60">
                        Prix unitaire: {selectedProductDetails.price.toFixed(2)} MAD
                      </p>
                      <p className="text-sm font-semibold">
                        Total: {(selectedProductDetails.price * quantity).toFixed(2)} MAD
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
    </StorefrontLayout>
  );
}

export default function ReservationsPage() {
  return (
    <Suspense
      fallback={
        <StorefrontLayout activePath="/reservations">
          <div className="flex flex-col items-center justify-center space-y-6 py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
            <p className="text-sm uppercase tracking-[0.35em] text-black/60">Chargement...</p>
          </div>
        </StorefrontLayout>
      }
    >
      <ReservationsContent />
    </Suspense>
  );
}
