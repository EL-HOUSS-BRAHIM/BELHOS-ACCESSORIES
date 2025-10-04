'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api, { getJson } from '@/lib/api';
import type { Product, Reservation } from '@/lib/types';
import { parseProductList, parseReservationList } from '@/lib/normalizers';
import { useDataSource } from '@/lib/DataSourceContext';
import { mockProducts, mockReservations } from '@/lib/mockData';
import {
  CATEGORY_LABEL_MAP,
  CATEGORY_OPTIONS,
  type CategoryValue,
  isAllowedCategoryValue,
} from '@/lib/categories';

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: '' | CategoryValue;
  stock: string;
};

const truncateText = (text: string, maxLength = 120) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'reservations' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
  });

  const { isAdmin, isHydrated } = useAuth();
  const router = useRouter();
  const { mode, setMode, isReady: isDataSourceReady } = useDataSource();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.debug('[Admin] Fetching dashboard data', { mode });

      let rawProducts: unknown;
      let rawReservations: unknown;

      if (mode === 'mock') {
        rawProducts = mockProducts;
        rawReservations = mockReservations;
        console.debug('[Admin] Using mock data for dashboard', {
          products: mockProducts.length,
          reservations: mockReservations.length,
        });
      } else {
        [rawProducts, rawReservations] = await Promise.all([
          getJson('/products'),
          getJson('/reservations'),
        ]);
      }
      if (!Array.isArray(rawProducts)) {
        console.warn('Unexpected products response payload', rawProducts);
      }
      if (!Array.isArray(rawReservations)) {
        console.warn('Unexpected reservations response payload', rawReservations);
      }

      const productsData = parseProductList(rawProducts);
      const reservationsData = parseReservationList(rawReservations);

      const toTimestamp = (value?: string) => {
        if (!value) {
          return 0;
        }

        const date = new Date(value);
        const time = date.getTime();
        return Number.isNaN(time) ? 0 : time;
      };

      const sortedProducts = [...productsData].sort(
        (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt),
      );
      setProducts(sortedProducts);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!isHydrated || !isDataSourceReady) {
      return;
    }

    if (!isAdmin) {
      router.push('/');
      return;
    }

    fetchData();
  }, [fetchData, isAdmin, isHydrated, isDataSourceReady, router]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.debug('[Admin] Creating product', { mode, formData });
      const resolvedCategory = formData.category || undefined;
      const resolvedDescription = formData.description.trim()
        ? formData.description
        : undefined;
      if (mode === 'mock') {
        const price = Number.parseFloat(formData.price);
        const stock = Number.parseInt(formData.stock, 10);
        const newProduct: Product = {
          id: `mock-prod-${Date.now()}`,
          name: formData.name,
          description: resolvedDescription,
          price: Number.isNaN(price) ? 0 : price,
          imageUrl: formData.imageUrl,
          category: resolvedCategory,
          stock: Number.isNaN(stock) ? 0 : stock,
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [newProduct, ...prev]);
      } else {
        await api.post('/products', {
          name: formData.name,
          description: resolvedDescription,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          category: resolvedCategory,
          stock: parseInt(formData.stock),
        });
      }
      resetForm();
      if (mode !== 'mock') {
        fetchData();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      console.debug('[Admin] Updating product', { mode, productId: editingProduct.id });
      const resolvedCategory = formData.category || undefined;
      const resolvedDescription = formData.description.trim()
        ? formData.description
        : undefined;
      if (mode === 'mock') {
        const price = Number.parseFloat(formData.price);
        const stock = Number.parseInt(formData.stock, 10);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id
              ? {
                  ...product,
                  name: formData.name,
                  description: resolvedDescription,
                  price: Number.isNaN(price) ? product.price : price,
                  imageUrl: formData.imageUrl,
                  category: resolvedCategory,
                  stock: Number.isNaN(stock) ? product.stock : stock,
                  updatedAt: new Date().toISOString(),
                }
              : product,
          ),
        );
      } else {
        await api.put(`/products/${editingProduct.id}`, {
          name: formData.name,
          description: resolvedDescription,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          category: resolvedCategory,
          stock: parseInt(formData.stock),
        });
      }
      resetForm();
      if (mode !== 'mock') {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;

    try {
      console.debug('[Admin] Deleting product', { mode, productId: id });
      if (mode === 'mock') {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } else {
        await api.delete(`/products/${id}`);
      }
      if (mode !== 'mock') {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      console.debug('[Admin] Updating reservation', { mode, reservationId: id, status });
      if (mode === 'mock') {
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.id === id
              ? {
                  ...reservation,
                  status,
                }
              : reservation,
          ),
        );
      } else {
        await api.put(`/reservations/${id}`, { status });
      }
      if (mode !== 'mock') {
        fetchData();
      }
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

  const handleCategorySelect = (value: string) => {
    if (value === '') {
      setFormData((prev) => ({ ...prev, category: '' }));
      return;
    }

    if (isAllowedCategoryValue(value)) {
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };

  const formatProductDate = (dateString?: string) => {
    if (!dateString) {
      return 'Date inconnue';
    }

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

  const isProductNew = (dateString?: string) => {
    if (!dateString) {
      return false;
    }

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
      category: product.category && isAllowedCategoryValue(product.category) ? product.category : '',
      stock: product.stock.toString(),
    });
    setShowProductForm(true);
  };

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl">Vérification de l&apos;authentification…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl">Redirection…</p>
      </div>
    );
  }

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
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-bold rounded-lg transition ${
            activeTab === 'settings'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Paramètres
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
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                      <td className="px-4 py-3">
                        {product.category ? CATEGORY_LABEL_MAP[product.category] : '—'}
                      </td>
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
              {reservations.map((reservation) => {
                const customerName = reservation.user?.name ?? 'Client inconnu';
                const customerEmail = reservation.user?.email ?? 'Email indisponible';

                return (
                <tr key={reservation.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{reservation.id}</td>
                  <td className="px-4 py-3">
                    {customerName}
                    <br />
                    <span className="text-sm text-gray-500">{customerEmail}</span>
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
              );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <h2 className="mb-3 text-2xl font-semibold tracking-[0.2em]">
              Paramètres du site
            </h2>
            <p className="mb-6 text-sm text-black/60">
              Choisissez la source de données utilisée pour la boutique et les réservations. Utilisez le mode maquette pour des
              démonstrations hors ligne ou revenez à l&apos;API pour travailler avec les données réelles.
            </p>

            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 p-4">
                <input
                  type="radio"
                  name="data-source-mode"
                  value="api"
                  checked={mode === 'api'}
                  onChange={() => setMode('api')}
                />
                <div>
                  <p className="font-semibold">API en direct</p>
                  <p className="text-sm text-black/60">
                    Les pages consomment les données du serveur et enregistrent les modifications réelles.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-black/10 p-4">
                <input
                  type="radio"
                  name="data-source-mode"
                  value="mock"
                  checked={mode === 'mock'}
                  onChange={() => setMode('mock')}
                />
                <div>
                  <p className="font-semibold">Données simulées</p>
                  <p className="text-sm text-black/60">
                    Les pages chargent un ensemble de données fictives. Les actions restent locales sans toucher au serveur.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Mode actuel : <strong>{mode === 'mock' ? 'Données simulées' : 'API en direct'}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
