const { db } = require('../config/firebase');

class Reservation {
  static async create(reservationData) {
    try {
      const reservationRef = await db.collection('reservations').add({
        userId: reservationData.userId,
        productId: reservationData.productId,
        quantity: reservationData.quantity,
        status: reservationData.status || 'pending',
        createdAt: new Date()
      });
      
      const reservationDoc = await reservationRef.get();
      return { id: reservationRef.id, ...reservationDoc.data() };
    } catch (error) {
      throw new Error(`Error creating reservation: ${error.message}`);
    }
  }

  static async findAll(options = {}) {
    try {
      let query = db.collection('reservations');
      
      // Add user filter if provided
      if (options.userId) {
        query = query.where('userId', '==', options.userId);
      }
      
      // Add status filter if provided
      if (options.status) {
        query = query.where('status', '==', options.status);
      }
      
      // Add ordering
      query = query.orderBy('createdAt', 'desc');
      
      const snapshot = await query.get();
      const reservations = [];
      
      // Get user and product details for each reservation
      for (const doc of snapshot.docs) {
        const reservationData = { id: doc.id, ...doc.data() };
        
        // Fetch user details
        const userDoc = await db.collection('users').doc(reservationData.userId).get();
        if (userDoc.exists) {
          reservationData.user = { id: userDoc.id, ...userDoc.data() };
        }
        
        // Fetch product details
        const productDoc = await db.collection('products').doc(reservationData.productId).get();
        if (productDoc.exists) {
          reservationData.product = { id: productDoc.id, ...productDoc.data() };
        }
        
        reservations.push(reservationData);
      }
      
      return reservations;
    } catch (error) {
      throw new Error(`Error fetching reservations: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const reservationDoc = await db.collection('reservations').doc(id).get();
      
      if (!reservationDoc.exists) {
        return null;
      }
      
      const reservationData = { id: reservationDoc.id, ...reservationDoc.data() };
      
      // Fetch user details
      const userDoc = await db.collection('users').doc(reservationData.userId).get();
      if (userDoc.exists) {
        reservationData.user = { id: userDoc.id, ...userDoc.data() };
      }
      
      // Fetch product details
      const productDoc = await db.collection('products').doc(reservationData.productId).get();
      if (productDoc.exists) {
        reservationData.product = { id: productDoc.id, ...productDoc.data() };
      }
      
      return reservationData;
    } catch (error) {
      throw new Error(`Error finding reservation: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      await db.collection('reservations').doc(id).update(updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating reservation: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      await db.collection('reservations').doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting reservation: ${error.message}`);
    }
  }

  static async findByUser(userId) {
    try {
      return await this.findAll({ userId });
    } catch (error) {
      throw new Error(`Error finding user reservations: ${error.message}`);
    }
  }

  static async updateStatus(id, status) {
    try {
      await db.collection('reservations').doc(id).update({ status });
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating reservation status: ${error.message}`);
    }
  }
}

module.exports = Reservation;