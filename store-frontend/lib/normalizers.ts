import type { Product, Reservation, ReservationUser } from './types';
import { isAllowedCategoryValue } from './categories';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const parseOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;

const parseString = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return null;
};

export const parseProduct = (value: unknown): Product | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  const name = parseString(value.name);
  const price = parseNumber(value.price);
  const imageUrl = parseString(value.imageUrl);
  const stock = parseNumber(value.stock);

  if ((typeof id !== 'string' && typeof id !== 'number') || !name || !imageUrl || price === null || stock === null) {
    return null;
  }

  const description = parseOptionalString(value.description);
  const rawCategory = parseOptionalString(value.category);
  const category = rawCategory && isAllowedCategoryValue(rawCategory) ? rawCategory : undefined;
  const createdAt = parseOptionalString(value.createdAt);
  const updatedAt = parseOptionalString(value.updatedAt);

  return {
    id: String(id),
    name,
    description,
    price,
    imageUrl,
    category,
    stock: Math.max(0, Math.floor(stock)),
    createdAt,
    updatedAt,
  } satisfies Product;
};

const parseReservationUser = (value: unknown): ReservationUser | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = value.id;
  const name = parseString(value.name);
  const email = parseString(value.email);

  if ((typeof id !== 'string' && typeof id !== 'number') || !name || !email) {
    return undefined;
  }

  return {
    id: String(id),
    name,
    email,
  } satisfies ReservationUser;
};

export const parseReservation = (value: unknown): Reservation | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  const quantity = parseNumber(value.quantity);
  const status = parseString(value.status);
  const createdAt = parseString(value.createdAt);
  const product = parseProduct(value.product);
  const user = parseReservationUser(value.user);

  if ((typeof id !== 'string' && typeof id !== 'number') || quantity === null || !status || !createdAt || !product) {
    return null;
  }

  return {
    id: String(id),
    quantity: Math.max(0, Math.floor(quantity)),
    status,
    createdAt,
    product,
    ...(user ? { user } : {}),
  } satisfies Reservation;
};

export const parseProductList = (value: unknown): Product[] =>
  Array.isArray(value) ? value.map(parseProduct).filter((product): product is Product => product !== null) : [];

export const parseReservationList = (value: unknown): Reservation[] =>
  Array.isArray(value)
    ? value.map(parseReservation).filter((reservation): reservation is Reservation => reservation !== null)
    : [];
