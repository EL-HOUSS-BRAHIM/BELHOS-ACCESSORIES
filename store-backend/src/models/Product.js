const { db } = require('../config/firebase');

const normalizeProductDocument = productDoc => {
  if (!productDoc || typeof productDoc.data !== 'function') {
    return null;
  }

  const data = productDoc.data();
  const isHot = data.isHot === true;
  const badge =
    typeof data.badge === 'string' && data.badge.trim().length > 0 ? data.badge.trim() : null;
  const salePrice =
    typeof data.salePrice === 'number' && Number.isFinite(data.salePrice) ? data.salePrice : null;

  return {
    id: productDoc.id,
    ...data,
    isHot,
    badge,
    salePrice
  };
};

class Product {
  static async create(productData) {
    try {
      const normalizedStock =
        typeof productData.stock === 'number' && Number.isFinite(productData.stock)
          ? Math.max(0, Math.trunc(productData.stock))
          : 0;

      const normalizedBadge =
        typeof productData.badge === 'string' && productData.badge.trim().length > 0
          ? productData.badge.trim()
          : null;

      const normalizedSalePrice =
        typeof productData.salePrice === 'number' && Number.isFinite(productData.salePrice)
          ? productData.salePrice
          : null;

      const payload = {
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        imageUrl: productData.imageUrl,
        category: productData.category || '',
        stock: normalizedStock,
        isHot: productData.isHot === true,
        badge: normalizedBadge,
        salePrice: normalizedSalePrice,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const productRef = await db.collection('products').add(payload);

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
      updateData.updatedAt = new Date();
      await db.collection('products').doc(id).update(updateData);
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
        updatedAt: new Date()
      });

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }
}

Product.normalizeProductDocument = normalizeProductDocument;

module.exports = Product;
