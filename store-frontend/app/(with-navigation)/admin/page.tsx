'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api, { getJson } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt?: string;
}

interface Reservation {
  id: string;
  quantity: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
  };
}

const truncateText = (text: string, maxLength = 120) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const ensureStringId = (record: Record<string, unknown>, key: string) => {
  const rawId = record[key];

  if (typeof rawId === 'string') {
    return rawId;
  }

  if (typeof rawId === 'number') {
    const normalized = rawId.toString();
    record[key] = normalized;
    return normalized;
  }

  return null;
};

const isProduct = (value: unknown): value is Product => {
  if (!isRecord(value)) return false;

  if (!ensureStringId(value, 'id')) {
    return false;
  }

  return (
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.createdAt === 'string' &&
    typeof value.imageUrl === 'string'
  );
};

const isReservation = (value: unknown): value is Reservation => {
  if (!isRecord(value)) return false;

  if (!ensureStringId(value, 'id')) {
    return false;
  }

  const { user, product } = value as {
    user?: unknown;
    product?: unknown;
  };

  if (!isRecord(user) || !isRecord(product)) {
    return false;
  }

  if (!ensureStringId(user, 'id') || !ensureStringId(product, 'id')) {
    return false;
  }

  return (
    typeof value.quantity === 'number' &&
    typeof value.status === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number'
  );
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'reservations'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
  });

  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
      return;
    }
    fetchData();
  }, [user, isAdmin, router]);

  const fetchData = async () => {
    try {
      const [rawProducts, rawReservations] = await Promise.all([
        getJson('/products'),
        getJson('/reservations'),
      ]);
      if (!Array.isArray(rawProducts)) {
        console.warn('Unexpected products response payload', rawProducts);
      }
      if (!Array.isArray(rawReservations)) {
        console.warn('Unexpected reservations response payload', rawReservations);
      }

      const productsData = Array.isArray(rawProducts)
        ? rawProducts.filter(isProduct)
        : [];
      const reservationsData = Array.isArray(rawReservations)
        ? rawReservations.filter(isReservation)
        : [];

      const sortedProducts = [...productsData].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setProducts(sortedProducts);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await api.put(`/products/${editingProduct.id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      await api.put(`/reservations/${id}`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category: '',
      stock: '',
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const formatProductDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return 'Date inconnue';
    }
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isProductNew = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return false;
    }
    const recentWindowMs = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - date.getTime() <= recentWindowMs;
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category || '',
      stock: product.stock.toString(),
    });
    setShowProductForm(true);
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
      <h1 className="text-4xl font-bold mb-8">Tableau de Bord Admin</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-bold rounded-lg transition ${
            activeTab === 'products'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Produits ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-6 py-3 font-bold rounded-lg transition ${
            activeTab === 'reservations'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Réservations ({reservations.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              {showProductForm ? 'Annuler' : 'Ajouter un Produit'}
            </button>
          </div>

          {showProductForm && (
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
              </h2>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Catégorie</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Prix (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2">URL de l&apos;image</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4 flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    {editingProduct ? 'Mettre à jour' : 'Créer'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Nom</th>
                  <th className="px-4 py-3 text-left">Catégorie</th>
                  <th className="px-4 py-3 text-left">Prix</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Créé le</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 3;

                  return (
                    <tr
                      key={product.id}
                      className={`border-b transition-colors ${
                        isOutOfStock
                          ? 'bg-gray-50 text-gray-500'
                          : isLowStock
                          ? 'bg-amber-50/80'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3">{product.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            {product.description && (
                              <p className="mt-1 text-sm text-gray-500">
                                {truncateText(product.description)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">{product.price.toFixed(2)} €</td>
                      <td className="px-4 py-3">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-black/50">
                            Rupture de stock
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{product.stock}</span>
                            {isLowStock && (
                              <span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white">
                                Dernières pièces
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{formatProductDate(product.createdAt)}</span>
                          {isProductNew(product.createdAt) && (
                            <span className="inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white">
                              Nouveau
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => startEdit(product)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Produit</th>
                <th className="px-4 py-3 text-left">Quantité</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{reservation.id}</td>
                  <td className="px-4 py-3">
                    {reservation.user.name}
                    <br />
                    <span className="text-sm text-gray-500">{reservation.user.email}</span>
                  </td>
                  <td className="px-4 py-3">{reservation.product.name}</td>
                  <td className="px-4 py-3">{reservation.quantity}</td>
                  <td className="px-4 py-3">
                    {(reservation.product.price * reservation.quantity).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-bold ${
                        reservation.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : reservation.status === 'confirmed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={reservation.status}
                      onChange={(e) =>
                        handleUpdateReservationStatus(reservation.id, e.target.value)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
