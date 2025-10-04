import type { CategoryValue } from './categories';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  category?: CategoryValue;
  stock: number;
  isHot?: boolean;
  badge?: string | null;
  salePrice?: number | null;
  createdAt?: string;
  updatedAt?: string;
  highlighted?: boolean;
  isNew?: boolean;
  originalPrice?: number;
  badges?: string[];
}

export interface ReservationUser {
  id: string;
  name: string;
  email: string;
}

export interface Reservation {
  id: string;
  quantity: number;
  status: string;
  createdAt: string;
  product: Product;
  user?: ReservationUser;
}
