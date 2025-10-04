const { db } = require('../config/firebase');

class User {
  static async create(userData) {
    try {
      const userRef = await db.collection('users').add({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'USER',
        createdAt: new Date()
      });
      
      const userDoc = await userRef.get();
      return { id: userRef.id, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  static async findFirstByRole(role) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('role', '==', role).limit(1).get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding user by role: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const userDoc = await db.collection('users').doc(id).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      await db.collection('users').doc(id).update(updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      await db.collection('users').doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = User;
