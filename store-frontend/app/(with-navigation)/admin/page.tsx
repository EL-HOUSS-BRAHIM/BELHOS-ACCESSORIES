'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

interface Reservation {
  id: number;
  quantity: number;
  status: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    price: number;
  };
}

const truncateText = (text: string, maxLength = 120) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
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
      const [productsRes, reservationsRes] = await Promise.all([
        api.get('/products'),
        api.get('/reservations'),
      ]);
      setProducts(productsRes.data);
      setReservations(reservationsRes.data);
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

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateReservationStatus = async (id: number, status: string) => {
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
          <div className="space-y-4 lg:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg sm:flex-row"
              >
                <div className="relative h-32 w-full overflow-hidden rounded-md border bg-gray-100 sm:h-24 sm:w-24">
                  <Image
                    src={product.imageUrl || '/window.svg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 96px"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.category || 'Sans catégorie'}
                      </p>
                    </div>
                    <span className="text-base font-bold text-blue-600">
                      {product.price.toFixed(2)} €
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {truncateText(product.description, 140) || 'Aucune description disponible.'}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500">
                      Stock : <span className="font-semibold text-gray-800">{product.stock}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="rounded bg-yellow-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-yellow-600"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
              <thead className="bg-gray-100 text-sm uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Produit</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Prix</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-600">{product.id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-gray-100">
                          <Image
                            src={product.imageUrl || '/window.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {product.category || 'Sans catégorie'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {truncateText(product.description, 100) || 'Aucune description disponible.'}
                    </td>
                    <td className="px-4 py-4 font-semibold text-blue-600">
                      {product.price.toFixed(2)} €
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{product.stock}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="rounded bg-yellow-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-yellow-600"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
