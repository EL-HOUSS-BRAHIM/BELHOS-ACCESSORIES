'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDataSource } from '@/lib/DataSourceContext';
import { parseProductList } from '@/lib/normalizers';
import { mockHighlightedProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { curatedCollections } from '@/components/CuratedCollections';

const AUTOPLAY_INTERVAL = 6500;

const madFormatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
});

const formatPrice = (value: number) => madFormatter.format(value);

const badgeStyles: Record<string, string> = {
  hot: 'bg-amber-500 text-white',
  new: 'bg-black text-white',
  discount: 'bg-red-500 text-white',
  default: 'bg-white text-black border border-black/10',
};

const getDiscountPercentage = (price: number, originalPrice?: number) => {
  if (!originalPrice || originalPrice <= price) {
    return null;
  }

  return Math.round(100 - (price / originalPrice) * 100);
};

export function HotProductsCarousel() {
  const { mode, isReady } = useDataSource();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchHighlightedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'mock') {
        setProducts(parseProductList(mockHighlightedProducts));
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const requestUrl = `${apiUrl}/products?highlighted=true`;
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`Impossible de charger les produits mis en avant (${response.status})`);
      }

      const data = await response.json();
      setProducts(parseProductList(data));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de charger les produits mis en avant';
      setError(message);
      console.error('[HotProductsCarousel] Failed to load highlighted products', err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void fetchHighlightedProducts();
  }, [fetchHighlightedProducts, isReady]);

  const highlightedProducts = useMemo(() => {
    if (products.length === 0) {
      return [] as Product[];
    }

    const flagged = products.filter((product) => product.highlighted);
    return flagged.length > 0 ? flagged : products;
  }, [products]);

  useEffect(() => {
    if (currentIndex >= highlightedProducts.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, highlightedProducts.length]);

  useEffect(() => {
    if (highlightedProducts.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % highlightedProducts.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      window.clearInterval(timer);
    };
  }, [highlightedProducts.length]);

  useEffect(() => {
    if (highlightedProducts.length > 0) {
      setCurrentIndex(0);
    }
  }, [highlightedProducts.length]);

  const handlePrevious = () => {
    if (highlightedProducts.length === 0) {
      return;
    }

    setCurrentIndex((previous) => (previous - 1 + highlightedProducts.length) % highlightedProducts.length);
  };

  const handleNext = () => {
    if (highlightedProducts.length === 0) {
      return;
    }

    setCurrentIndex((previous) => (previous + 1) % highlightedProducts.length);
  };

  if (loading) {
    return (
      <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="h-8 w-48 rounded-full bg-black/10" />
          <div className="h-12 w-3/4 rounded-full bg-black/10" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded-full bg-black/10" />
            <div className="h-4 w-5/6 rounded-full bg-black/10" />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="h-10 w-44 rounded-full bg-black/10" />
            <div className="h-10 w-48 rounded-full bg-black/10" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-28 rounded-2xl bg-black/5" />
            <div className="h-28 rounded-2xl bg-black/5" />
            <div className="h-28 rounded-2xl bg-black/5" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-80 w-full rounded-[32px] border border-black/10 bg-black/5" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-28 rounded-2xl bg-black/5" />
            <div className="h-28 rounded-2xl bg-black/5" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[32px] border border-black/10 bg-white p-12 text-center shadow-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Produit mis en avant</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-[0.15em]">Impossible de charger les produits</h2>
        <p className="mt-3 text-sm text-black/60">{error}</p>
        <button
          onClick={fetchHighlightedProducts}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-black/80"
        >
          Réessayer
        </button>
      </section>
    );
  }

  if (highlightedProducts.length === 0) {
    return null;
  }

  const product = highlightedProducts[currentIndex];
  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.price;
  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice ?? undefined);

  const badgeEntries = [
    ...(product.isHot ? [{ label: 'Coup de cœur', variant: 'hot' as const }] : []),
    ...(product.isNew ? [{ label: 'Nouveauté', variant: 'new' as const }] : []),
    ...(hasDiscount && discountPercentage !== null
      ? [{ label: `-${discountPercentage}%`, variant: 'discount' as const }]
      : []),
    ...(product.badges?.map((label) => ({ label, variant: 'default' as const })) ?? []),
  ];

  const stockLabel = product.stock === 0 ? 'Rupture momentanée' : product.stock <= 5 ? `${product.stock} pièces` : `${product.stock}+ pièces`;
  const lastUpdateLabel = product.updatedAt
    ? new Intl.DateTimeFormat('fr-MA', { day: '2-digit', month: 'short' }).format(new Date(product.updatedAt))
    : 'Cette semaine';

  return (
    <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          {badgeEntries.length === 0 ? (
            <span className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white">
              Sélection Belhos
            </span>
          ) : (
            badgeEntries.map((badge) => (
              <span
                key={`${badge.variant}-${badge.label}`}
                className={`inline-flex items-center rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] ${badgeStyles[badge.variant] ?? badgeStyles.default}`}
              >
                {badge.label}
              </span>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-[0.15em] sm:text-4xl lg:text-5xl">{product.name}</h1>
          {product.description && (
            <p className="max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">{product.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[0.65rem] uppercase tracking-[0.25em]">
          <span className="text-2xl font-semibold tracking-[0.15em] sm:text-3xl">{formatPrice(product.price)}</span>
          {hasDiscount && product.originalPrice && (
            <span className="text-sm font-medium text-black/50 line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {product.category && <span className="rounded-full border border-black/10 px-3 py-1 text-black/60">{product.category}</span>}
        </div>

        <div className="flex flex-wrap gap-4 text-[0.65rem] uppercase tracking-[0.25em]">
          <Link
            href="/boutique"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-black/80"
          >
            Découvrir la boutique
          </Link>
          <Link
            href="#collections"
            className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 font-semibold transition hover:bg-black hover:text-white"
          >
            Explorer les collections
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Disponibilité</p>
            <p className="mt-3 text-xl font-semibold">{stockLabel}</p>
            <p className="mt-1 text-xs text-black/60">Stock surveillé en temps réel</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Actualisé</p>
            <p className="mt-3 text-xl font-semibold">{lastUpdateLabel}</p>
            <p className="mt-1 text-xs text-black/60">Dernière mise à jour</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">Intérêt</p>
            <p className="mt-3 text-xl font-semibold">{product.isHot ? 'Très élevé' : 'Équilibré'}</p>
            <p className="mt-1 text-xs text-black/60">Suivi par notre équipe</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-4 shadow-lg shadow-black/5">
          <div className="relative h-72 w-full overflow-hidden rounded-[24px] sm:h-[22rem]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-700"
              priority
            />
            {hasDiscount && discountPercentage !== null && (
              <div className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                Promo -{discountPercentage}%
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-8">
            <div className="flex items-center gap-2">
              {highlightedProducts.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition ${
                    index === currentIndex ? 'w-8 bg-black' : 'w-3 bg-black/30 hover:bg-black/60'
                  }`}
                >
                  <span className="sr-only">{`Voir ${item.name}`}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/40"
                aria-label="Voir le produit précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/40"
                aria-label="Voir le produit suivant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {curatedCollections.slice(0, 2).map((collection) => (
            <div key={collection.title} className="rounded-2xl border border-black/10 bg-white p-5 text-sm shadow-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-black/60">{collection.title}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-black/60">{collection.priceRange}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
