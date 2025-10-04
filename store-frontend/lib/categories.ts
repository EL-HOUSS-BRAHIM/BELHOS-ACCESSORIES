export const CATEGORY_OPTIONS = [
  { value: 'tech', label: 'Tech & Gadgets' },
  { value: 'shoes', label: 'Chaussures' },
  { value: 'clothes', label: 'Vêtements' },
  { value: 'necklace', label: 'Colliers' },
  { value: 'bracelet', label: 'Bracelets' },
  { value: 'earrings', label: 'Boucles d\u2019oreilles' },
  { value: 'watch', label: 'Montres' },
  { value: 'bag', label: 'Sacs & Maroquinerie' },
] as const;

export type CategoryValue = (typeof CATEGORY_OPTIONS)[number]['value'];

export const CATEGORY_VALUE_SET = new Set(
  CATEGORY_OPTIONS.map((option) => option.value),
);

export const CATEGORY_LABEL_MAP: Record<CategoryValue, string> =
  CATEGORY_OPTIONS.reduce<Record<CategoryValue, string>>((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, Object.create(null));

export const isAllowedCategoryValue = (
  value: unknown,
): value is CategoryValue =>
  typeof value === 'string' && CATEGORY_VALUE_SET.has(value as CategoryValue);

export const getCategoryLabel = (value?: string) => {
  if (!value || !isAllowedCategoryValue(value)) {
    return undefined;
  }
  return CATEGORY_LABEL_MAP[value];
};
