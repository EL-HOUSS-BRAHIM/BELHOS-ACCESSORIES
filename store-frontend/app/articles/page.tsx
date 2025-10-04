'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { API_URL } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/articles', label: 'Boutique' },
  { href: '/reservations', label: 'Réservations' },
  { href: '/contact', label: 'Contact' },
];

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filter.toLowerCase()) ||
                         product.description?.toLowerCase().includes(filter.toLowerCase()) ||
                         product.category?.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading State
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
            <p className="text-sm uppercase tracking-[0.35em] text-black/60">Chargement de la boutique...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
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
        <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
          <div className="rounded-3xl border border-black/10 bg-white p-12 text-center shadow-sm">
            <div className="text-4xl mb-6">⚠️</div>
            <h2 className="mb-3 text-xl font-semibold tracking-[0.2em]">Une erreur est survenue</h2>
            <p className="mb-8 text-sm text-black/60">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-black/80"
            >
              Réessayer
            </button>
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
                  link.href === '/articles' ? 'text-black' : 'hover:text-black/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {user ? (
            <Link
              href="/reservations"
              className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
            >
              Mes réservations
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
            >
              Se connecter
            </Link>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 space-y-8 text-center">
          <span className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white">
            Boutique Exclusive
          </span>
          <h1 className="text-4xl font-semibold tracking-[0.2em] sm:text-5xl">
            Collections Belhos
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
            Découvrez nos accessoires raffinés, conçus avec passion et précision.
            Chaque pièce est sélectionnée pour sublimer votre style au quotidien.
          </p>
        </section>

        {/* Search and Filters */}
        <section className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="mx-auto max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-full border border-black/20 bg-white px-6 py-3 pl-12 text-sm uppercase tracking-[0.15em] placeholder:text-black/40 focus:border-black focus:outline-none"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-black/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'border border-black/20 hover:border-black'
                  }`}
                >
                  {category === 'all' ? 'Tout' : category}
                </button>
              ))}
            </div>
          )}

          {/* Results Count */}
          <p className="text-center text-[0.65rem] uppercase tracking-[0.35em] text-black/60">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </section>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mb-6 text-4xl text-black/20">🔍</div>
            <h3 className="mb-3 text-xl font-semibold tracking-[0.2em]">
              Aucun produit trouvé
            </h3>
            <p className="text-sm text-black/60">
              {filter || selectedCategory !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche' 
                : 'Aucun produit disponible pour le moment'}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                        Rupture de stock
                      </span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 3 && (
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-black px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white">
                        Dernières pièces
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="mb-2 text-base font-semibold tracking-[0.15em]">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-black/60">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-semibold">
                      {product.price.toFixed(2)} MAD
                    </span>
                    {product.stock > 0 && (
                      <span className="text-[0.65rem] uppercase tracking-[0.3em] text-black/50">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Reserve Button */}
                  {user ? (
                    <Link
                      href={`/reservations?productId=${product.id}`}
                      className={`block w-full rounded-full py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition ${
                        product.stock > 0
                          ? 'bg-black text-white hover:bg-black/80'
                          : 'cursor-not-allowed bg-black/10 text-black/30'
                      }`}
                      onClick={(e) => product.stock === 0 && e.preventDefault()}
                    >
                      {product.stock > 0 ? 'Réserver' : 'Indisponible'}
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full rounded-full border border-black py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
                    >
                      Se connecter
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredProducts.length > 0 && (
          <section className="mt-24 rounded-3xl border border-black/10 bg-white p-12 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold tracking-[0.2em]">
              Besoin d&apos;aide ?
            </h2>
            <p className="mb-8 text-sm text-black/60">
              Notre équipe est à votre disposition pour toute question sur nos produits
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
            >
              Nous contacter
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
