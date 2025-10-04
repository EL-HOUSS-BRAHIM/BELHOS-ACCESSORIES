const { db } = require('../config/firebase');
const { resolveTimestamp } = require('../config/launchDate');

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
        stock: rest.stock || 0,
        createdAt: resolveTimestamp(createdAt),
        updatedAt: resolveTimestamp(updatedAt || createdAt),
      };

      const productRef = await db.collection('products').add(productRecord);
      
      const productDoc = await productRef.get();
      return { id: productRef.id, ...productDoc.data() };
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
        products.push({ id: doc.id, ...doc.data() });
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
      
      return { id: productDoc.id, ...productDoc.data() };
    } catch (error) {
      throw new Error(`Error finding product: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const dataToPersist = {
        ...updateData,
        updatedAt: resolveTimestamp(updateData.updatedAt, { fallbackToCurrent: true }),
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
        updatedAt: resolveTimestamp(undefined, { fallbackToCurrent: true }),
      });

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }
}

module.exports = Product;
