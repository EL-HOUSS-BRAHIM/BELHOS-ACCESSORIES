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

const parseOptionalBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y', 'vrai', 'oui'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'n', 'faux', 'non'].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === 'number') {
    if (Number.isFinite(value)) {
      return value !== 0;
    }
  }

  return undefined;
};

const parseOptionalNumber = (value: unknown): number | undefined => {
  const parsed = parseNumber(value);
  return parsed === null ? undefined : parsed;
};

const parseOptionalStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const entries = value
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (isRecord(item) && typeof item.label === 'string') {
        return item.label;
      }

      return null;
    })
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0);

  return entries.length > 0 ? entries : undefined;
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
  const isHot = parseBooleanFlag(value.isHot);

  if ((typeof id !== 'string' && typeof id !== 'number') || !name || !imageUrl || price === null || stock === null) {
    return null;
  }

  const description = parseOptionalString(value.description);
  const rawCategory = parseOptionalString(value.category);
  const category = rawCategory && isAllowedCategoryValue(rawCategory) ? rawCategory : undefined;
  const createdAt = parseOptionalString(value.createdAt);
  const updatedAt = parseOptionalString(value.updatedAt);
  const highlighted = parseOptionalBoolean(value.highlighted ?? value.isHighlighted);
  const isHot = parseOptionalBoolean(value.isHot ?? value.hot ?? value.isHotProduct);
  const isNew = parseOptionalBoolean(value.isNew ?? value.new ?? value.isNewArrival ?? value.isNewProduct);
  const originalPrice = parseOptionalNumber(value.originalPrice ?? value.compareAtPrice ?? value.listPrice);
  const badges = parseOptionalStringArray(value.badges ?? value.tags ?? value.labels);

  return {
    id: String(id),
    name,
    description,
    price,
    imageUrl,
    category,
    stock: Math.max(0, Math.floor(stock)),
    isHot: isHot ?? false,
    badge,
    salePrice,
    createdAt,
    updatedAt,
    ...(highlighted !== undefined ? { highlighted } : {}),
    ...(isHot !== undefined ? { isHot } : {}),
    ...(isNew !== undefined ? { isNew } : {}),
    ...(originalPrice !== undefined ? { originalPrice } : {}),
    ...(badges ? { badges } : {}),
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
