const { db } = require('../config/firebase');
const { resolveTimestamp } = require('../config/launchDate');

const sanitizeBadgeEntries = entries => {
  if (!Array.isArray(entries)) {
    return undefined;
  }

  const sanitized = entries.reduce((acc, entry) => {
    if (typeof entry === 'string') {
      const trimmed = entry.trim();
      if (trimmed.length > 0) {
        acc.push(trimmed);
      }
      return acc;
    }

    if (entry && typeof entry === 'object' && typeof entry.label === 'string') {
      const trimmedLabel = entry.label.trim();
      if (trimmedLabel.length > 0) {
        acc.push(trimmedLabel);
      }
      return acc;
    }

    return acc;
  }, []);

  return sanitized.length > 0 ? sanitized : [];
};

const normalizeProductDocument = productDoc => {
  if (!productDoc || typeof productDoc.data !== 'function') {
    return null;
  }

  const data = productDoc.data();
  const isHot = data.isHot === true;
  const highlighted = data.highlighted === true;
  const isNew = data.isNew === true;
  const badge =
    typeof data.badge === 'string' && data.badge.trim().length > 0 ? data.badge.trim() : null;
  const salePrice =
    typeof data.salePrice === 'number' && Number.isFinite(data.salePrice) ? data.salePrice : null;
  const originalPrice =
    typeof data.originalPrice === 'number' && Number.isFinite(data.originalPrice)
      ? data.originalPrice
      : null;
  const badges = sanitizeBadgeEntries(data.badges);

  return {
    id: productDoc.id,
    ...data,
    isHot,
    highlighted,
    isNew,
    badge,
    salePrice,
    originalPrice,
    badges
  };
};

class Product {
  static async create(productData) {
    try {
      const { createdAt, updatedAt, ...rest } = productData || {};
      const productRecord = {
        name: rest.name,
        description: rest.description || '',
        price: rest.price,
        imageUrl: rest.imageUrl,
        category: rest.category || '',
        stock: typeof rest.stock === 'number' && Number.isFinite(rest.stock) ? rest.stock : 0,
        createdAt: resolveTimestamp(createdAt),
        updatedAt: resolveTimestamp(updatedAt || createdAt)
      };

      if (rest.isHot !== undefined) {
        productRecord.isHot = rest.isHot === true;
      }

      if (rest.highlighted !== undefined) {
        productRecord.highlighted = rest.highlighted === true;
      }

      if (rest.isNew !== undefined) {
        productRecord.isNew = rest.isNew === true;
      }

      if (Object.prototype.hasOwnProperty.call(rest, 'badge')) {
        if (rest.badge === null) {
          productRecord.badge = null;
        } else if (typeof rest.badge === 'string') {
          const trimmedBadge = rest.badge.trim();
          productRecord.badge = trimmedBadge.length > 0 ? trimmedBadge : null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(rest, 'salePrice')) {
        if (rest.salePrice === null) {
          productRecord.salePrice = null;
        } else if (typeof rest.salePrice === 'number' && Number.isFinite(rest.salePrice)) {
          productRecord.salePrice = rest.salePrice;
        }
      }

      if (Object.prototype.hasOwnProperty.call(rest, 'originalPrice')) {
        if (rest.originalPrice === null) {
          productRecord.originalPrice = null;
        } else if (typeof rest.originalPrice === 'number' && Number.isFinite(rest.originalPrice)) {
          productRecord.originalPrice = rest.originalPrice;
        }
      }

      if (Object.prototype.hasOwnProperty.call(rest, 'badges')) {
        if (rest.badges === null) {
          productRecord.badges = [];
        } else if (Array.isArray(rest.badges)) {
          const sanitizedBadges = sanitizeBadgeEntries(rest.badges);
          if (sanitizedBadges !== undefined) {
            productRecord.badges = sanitizedBadges;
          }
        }
      }

      const productRef = await db.collection('products').add(productRecord);

      const productDoc = await productRef.get();
      const normalized = normalizeProductDocument(productDoc);
      if (!normalized) {
        throw new Error('Created product could not be normalized');
      }

      return normalized;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  static async findAll(options = {}) {
    try {
      let query = db.collection('products');
      
      // Add category filter if provided
      if (options.category) {
        query = query.where('category', '==', options.category);
      }
      
      // Add ordering
      if (options.orderBy) {
        query = query.orderBy(options.orderBy, options.order || 'asc');
      }
      
      // Add pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const snapshot = await query.get();
      const products = [];
      
      snapshot.forEach(doc => {
        const normalized = normalizeProductDocument(doc);
        if (normalized) {
          products.push(normalized);
        }
      });

      return products;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const productDoc = await db.collection('products').doc(id).get();

      if (!productDoc.exists) {
        return null;
      }

      const normalized = normalizeProductDocument(productDoc);
      if (!normalized) {
        throw new Error('Product document is malformed');
      }

      return normalized;
    } catch (error) {
      throw new Error(`Error finding product: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const dataToPersist = {
        ...updateData,
        updatedAt: resolveTimestamp(updateData.updatedAt),
      };
      await db.collection('products').doc(id).update(dataToPersist);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      await db.collection('products').doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  static async updateStock(id, stockChange) {
    if (typeof stockChange !== 'number' || !Number.isFinite(stockChange) || !Number.isInteger(stockChange)) {
      throw new Error('Invalid stock change value');
    }

    try {
      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();

      if (!product.exists) {
        throw new Error('Product not found');
      }

      const rawStock = product.data().stock;
      const currentStock = rawStock === undefined ? 0 : rawStock;

      if (typeof currentStock !== 'number' || !Number.isFinite(currentStock) || !Number.isInteger(currentStock)) {
        throw new Error('Invalid product stock value');
      }

      const newStock = currentStock + stockChange;

      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }

      if (!Number.isInteger(newStock)) {
        throw new Error('Invalid resulting stock value');
      }

      await productRef.update({
        stock: Math.trunc(newStock),
        updatedAt: resolveTimestamp()
      });

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }
}

Product.normalizeProductDocument = normalizeProductDocument;

module.exports = Product;
