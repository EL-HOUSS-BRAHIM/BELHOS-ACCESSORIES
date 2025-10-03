const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseApp;

if (!admin.apps.length) {
  try {
    // For production/Vercel deployment
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } else {
      // For local development - you'll need to add your service account file
      console.log('Using default Firebase credentials for development');
      firebaseApp = admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
} else {
  firebaseApp = admin.app();
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };