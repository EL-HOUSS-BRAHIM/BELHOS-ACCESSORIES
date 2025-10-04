import type { Product, Reservation } from './types';

const CAMPAIGN_BASE_ISO = '2025-10-01T09:00:00.000Z';

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
    category: 'Bracelets',
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
    category: 'Colliers',
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
    category: 'Boucles',
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
    category: 'Maroquinerie',
    stock: 4,
    createdAt: new Date(now.getTime() - dayInMs / 2).toISOString(),
    updatedAt: new Date(now.getTime() - dayInMs / 4).toISOString(),
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
    category: 'Horlogerie',
    stock: 3,
    createdAt: new Date(now.getTime() - 2 * dayInMs).toISOString(),
    updatedAt: new Date(now.getTime() - dayInMs).toISOString(),
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
    category: 'Bijoux',
    stock: 8,
    createdAt: new Date(now.getTime() - dayInMs).toISOString(),
    updatedAt: new Date(now.getTime() - dayInMs / 6).toISOString(),
    highlighted: true,
    isNew: true,
    badges: ['Nouvelle collection'],
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
