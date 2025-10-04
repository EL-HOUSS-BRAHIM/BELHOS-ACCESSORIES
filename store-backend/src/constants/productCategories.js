const PRODUCT_CATEGORIES = [
  { value: 'tech', label: 'Tech & Gadgets' },
  { value: 'shoes', label: 'Chaussures' },
  { value: 'clothes', label: 'Vêtements' },
  { value: 'necklace', label: 'Colliers' },
  { value: 'bracelet', label: 'Bracelets' },
  { value: 'earrings', label: 'Boucles d\u2019oreilles' },
  { value: 'watch', label: 'Montres' },
  { value: 'bag', label: 'Sacs & Maroquinerie' },
];

const CATEGORY_VALUES = PRODUCT_CATEGORIES.map((category) => category.value);

const isValidCategoryValue = (value) =>
  typeof value === 'string' && CATEGORY_VALUES.includes(value);

module.exports = {
  PRODUCT_CATEGORIES,
  CATEGORY_VALUES,
  isValidCategoryValue,
};
