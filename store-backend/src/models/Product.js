const { db } = require('../config/firebase');

class Product {
  static async create(productData) {
    try {
      const productRef = await db.collection('products').add({
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        imageUrl: productData.imageUrl,
        category: productData.category || '',
        stock: productData.stock || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
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
    try {
      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();
      
      if (!product.exists) {
        throw new Error('Product not found');
      }
      
      const currentStock = product.data().stock || 0;
      const newStock = currentStock + stockChange;
      
      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }
      
      await productRef.update({
        stock: newStock,
        updatedAt: new Date()
      });
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }
}

module.exports = Product;