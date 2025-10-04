export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  category?: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
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
