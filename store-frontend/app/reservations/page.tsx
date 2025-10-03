'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
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

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/reservations', {
        productId: parseInt(selectedProduct),
        quantity: parseInt(quantity.toString()),
      });
      setSuccess('Réservation créée avec succès!');
      setSelectedProduct('');
      setQuantity(1);
      fetchData();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de la réservation');
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      setSuccess('Réservation annulée avec succès!');
      fetchData();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de l\'annulation');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Mes Réservations</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Create New Reservation */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Nouvelle Réservation</h2>
        <form onSubmit={handleCreateReservation} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Produit</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un produit</option>
              {products.filter(p => p.stock > 0).map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.price.toFixed(2)} € (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Quantité</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Réserver
            </button>
          </div>
        </form>
      </div>

      {/* Reservations List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Mes Réservations Actives</h2>
        {reservations.length === 0 ? (
          <p className="text-gray-600">Aucune réservation pour le moment</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-200 relative">
                  <Image
                    src={reservation.product.imageUrl}
                    alt={reservation.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{reservation.product.name}</h3>
                  <p className="text-gray-600 mb-2">Quantité: {reservation.quantity}</p>
                  <p className="text-gray-600 mb-2">
                    Total: {(reservation.product.price * reservation.quantity).toFixed(2)} €
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Statut:{' '}
                    <span
                      className={`font-bold ${
                        reservation.status === 'pending'
                          ? 'text-yellow-600'
                          : reservation.status === 'confirmed'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </p>
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
