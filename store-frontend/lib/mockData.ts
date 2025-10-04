import type { Product, Reservation } from './types';

const now = new Date();
const dayInMs = 24 * 60 * 60 * 1000;

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
    createdAt: new Date(now.getTime() - dayInMs).toISOString(),
    updatedAt: new Date(now.getTime() - dayInMs / 2).toISOString(),
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
    createdAt: new Date(now.getTime() - 3 * dayInMs).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * dayInMs).toISOString(),
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
    createdAt: new Date(now.getTime() - 7 * dayInMs).toISOString(),
    updatedAt: new Date(now.getTime() - 6 * dayInMs).toISOString(),
  },
];

export const mockReservations: Reservation[] = [
  {
    id: 'mock-res-1',
    quantity: 1,
    status: 'pending',
    createdAt: new Date(now.getTime() - 2 * dayInMs).toISOString(),
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
    createdAt: new Date(now.getTime() - 5 * dayInMs).toISOString(),
    product: mockProducts[1],
    user: {
      id: 'mock-user-2',
      name: 'Karim',
      email: 'karim@example.com',
    },
  },
];
