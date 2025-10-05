import type { Product, Reservation } from './types';
import { CAMPAIGN_BASE_ISO } from './campaign';

const isoFromCampaign = (daysOffset: number, hoursOffset = 0) => {
  const base = new Date(CAMPAIGN_BASE_ISO);
  base.setUTCDate(base.getUTCDate() + daysOffset);
  base.setUTCHours(base.getUTCHours() + hoursOffset);
  return base.toISOString();
};

export const mockProducts: Product[] = [
  {
    id: 'mock-prod-1',
    name: 'Bracelet Éclat Doré',
    description:
      "Un bracelet raffiné en or plaqué avec des détails délicats pour sublimer vos tenues d'exception.",
    price: 129.99,
    imageUrl:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
    category: 'bracelet',
    stock: 5,
    createdAt: isoFromCampaign(2, 3),
    updatedAt: isoFromCampaign(3, 1),
  },
  {
    id: 'mock-prod-2',
    name: 'Collier Perles de Lune',
    description: 'Un collier élégant composé de perles nacrées inspirées de la lueur de la lune.',
    price: 189.5,
    imageUrl:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b2?auto=format&fit=crop&w=600&q=80',
    category: 'necklace',
    stock: 2,
    createdAt: isoFromCampaign(5, 6),
    updatedAt: isoFromCampaign(6, 2),
  },
  {
    id: 'mock-prod-3',
    name: 'Boucles d’oreilles Argent Polaris',
    description: 'Boucles d’oreilles en argent sterling ornées de zircons étincelants.',
    price: 79.9,
    imageUrl:
      'https://images.unsplash.com/photo-1520962918287-7448c2878f65?auto=format&fit=crop&w=600&q=80',
    category: 'earrings',
    stock: 0,
    createdAt: isoFromCampaign(8, 9),
    updatedAt: isoFromCampaign(9, 4),
  },
];

export const mockHighlightedProducts: Product[] = [
  {
    id: 'mock-highlight-1',
    name: 'Sac Cuir Opaline',
    description:
      'Cuir grainé ivoire, doublure en satin champagne et poignée torsadée confectionnée à la main.',
    price: 980,
    originalPrice: 1120,
    imageUrl:
      'https://images.unsplash.com/photo-1612810806695-30ba0b38fa13?auto=format&fit=crop&w=900&q=80',
    category: 'bag',
    stock: 4,
    createdAt: isoFromCampaign(0, 12),
    updatedAt: isoFromCampaign(1, 6),
    highlighted: true,
    isHot: true,
    badges: ['Atelier Casablanca'],
  },
  {
    id: 'mock-highlight-2',
    name: 'Montre Saphir Nuit',
    description:
      'Boîtier en acier bleu nuit, cadran laqué et bracelet en cuir nubuck avec surpiqûres main.',
    price: 1480,
    originalPrice: 1680,
    imageUrl:
      'https://images.unsplash.com/photo-1519408469771-2586093c3f14?auto=format&fit=crop&w=900&q=80',
    category: 'watch',
    stock: 3,
    createdAt: isoFromCampaign(1, 18),
    updatedAt: isoFromCampaign(2, 12),
    highlighted: true,
    isHot: true,
    badges: ['Édition numérotée'],
  },
  {
    id: 'mock-highlight-3',
    name: 'Boucles Lumière Azur',
    description:
      'Argent rhodié et quartz bleuté, montés sur un serti griffes inspiré des motifs andalous.',
    price: 620,
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    category: 'earrings',
    stock: 8,
    createdAt: isoFromCampaign(2, 20),
    updatedAt: isoFromCampaign(3, 8),
    highlighted: true,
    isNew: true,
    badges: ['Nouvelle collection'],
  },
  {
    id: 'mock-prod-4',
    name: 'Sneakers Cuir Urbaines',
    description: 'Des baskets en cuir pleine fleur avec semelle amortissante pour un confort premium.',
    price: 159.0,
    imageUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    category: 'shoes',
    stock: 8,
    createdAt: isoFromCampaign(3, 12),
    updatedAt: isoFromCampaign(4, 4),
  },
  {
    id: 'mock-prod-5',
    name: 'Sac cabas Cuir Cognac',
    description: 'Un sac cabas spacieux en cuir grainé avec poignées renforcées.',
    price: 249.5,
    imageUrl:
      'https://images.unsplash.com/photo-1612810806695-30ba0a094907?auto=format&fit=crop&w=600&q=80',
    category: 'bag',
    stock: 4,
    createdAt: isoFromCampaign(4, 18),
    updatedAt: isoFromCampaign(5, 10),
  },
  {
    id: 'mock-prod-6',
    name: 'Montre Acier Graphite',
    description: 'Un garde-temps minimaliste avec bracelet en maille milanaise.',
    price: 299.99,
    imageUrl:
      'https://images.unsplash.com/photo-1524594154907-23c985ca5c0c?auto=format&fit=crop&w=600&q=80',
    category: 'watch',
    stock: 3,
    createdAt: isoFromCampaign(5, 22),
    updatedAt: isoFromCampaign(7, 6),
  },
  {
    id: 'mock-prod-7',
    name: 'Chemisier Soie Écru',
    description: 'Une coupe fluide en soie naturelle pour une allure sophistiquée.',
    price: 139.99,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    category: 'clothes',
    stock: 6,
    createdAt: isoFromCampaign(7, 12),
    updatedAt: isoFromCampaign(8, 9),
  },
  {
    id: 'mock-prod-8',
    name: 'Écouteurs Sans Fil Signature',
    description: 'Réduction de bruit active et autonomie de 24h pour accompagner vos journées.',
    price: 219.0,
    imageUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    category: 'tech',
    stock: 10,
    createdAt: isoFromCampaign(6, 15),
    updatedAt: isoFromCampaign(7, 18),
  },
];

export const mockReservations: Reservation[] = [
  {
    id: 'mock-res-1',
    quantity: 1,
    status: 'pending',
    createdAt: isoFromCampaign(4, 5),
    product: mockProducts[0],
    user: {
      id: 'mock-user-1',
      name: 'Amina',
      email: 'amina@example.com',
    },
  },
  {
    id: 'mock-res-2',
    quantity: 2,
    status: 'confirmed',
    createdAt: isoFromCampaign(7, 8),
    product: mockProducts[1],
    user: {
      id: 'mock-user-2',
      name: 'Karim',
      email: 'karim@example.com',
    },
  },
];
