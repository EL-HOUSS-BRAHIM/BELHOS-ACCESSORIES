# BELHOS-ACCESSORIES Deployment Guide

## Overview
This guide will help you deploy the BELHOS-ACCESSORIES application to Vercel with Firebase as the database backend.

## Prerequisites
- Vercel account (free tier available)
- Firebase project
- Node.js 18+ installed locally
- Git repository access

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `belhos-accessories` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web app" icon (</>)
4. Register app with name "BELHOS Accessories Frontend"
5. Copy the configuration object
6. Enable Firebase Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

### 4. Create Service Account (for Backend)
1. In Firebase Console, go to Project Settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Keep this file secure - you'll need it for backend deployment

## Backend Deployment (Vercel)

### 1. Prepare Environment Variables
Create the following environment variables in Vercel:

```bash
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id",...}
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=production
```

### 2. Deploy Backend
1. Navigate to the backend directory:
   ```bash
   cd store-backend
   ```

2. Install Vercel CLI (if not installed):
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

5. Set environment variables in Vercel Dashboard:
   - Go to your project in Vercel Dashboard
   - Navigate to Settings > Environment Variables
   - Add the variables listed above

### 3. Update CORS Settings
The serverless functions include CORS headers, but ensure your Firebase Firestore rules allow your domain:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN";
    }
    
    // Reservations are readable/writable by owner or admin
    match /reservations/{reservationId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN");
    }
  }
}
```

## Frontend Deployment (Vercel)

### 1. Prepare Environment Variables
In your Vercel project for the frontend, add these environment variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-app.vercel.app/api

# Firebase Configuration (from step 3 of Firebase setup)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Deploy Frontend
1. Navigate to the frontend directory:
   ```bash
   cd store-frontend
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Set environment variables in Vercel Dashboard (as done for backend)

## Post-Deployment Setup

### 1. Create Admin User
Since there's no admin interface yet, you'll need to create an admin user manually:

1. Register a user through your frontend application
2. Go to Firebase Console > Firestore Database
3. Find the user document in the `users` collection
4. Edit the document and change `role` from `"USER"` to `"ADMIN"`

### 2. Add Sample Products
You can add products through the admin interface or directly in Firestore:

```json
{
  "name": "Sample Product",
  "description": "Product description",
  "price": 29.99,
  "imageUrl": "https://example.com/image.jpg",
  "category": "accessories",
  "stock": 10,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Testing

### 1. Test API Endpoints
Test your backend endpoints:
- `GET https://your-backend.vercel.app/api/products` - Should return products
- `POST https://your-backend.vercel.app/api/auth/register` - Register new user
- `POST https://your-backend.vercel.app/api/auth/login` - Login user

### 2. Test Frontend
- User registration and login
- Product browsing
- Reservation creation (logged-in users)
- Admin features (admin users)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS headers are set in API functions
   - Check Vercel function logs

2. **Firebase Connection Issues**
   - Verify environment variables are set correctly
   - Check Firebase project permissions
   - Ensure service account key is properly formatted JSON

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are properly installed
   - Review Vercel build logs

4. **Authentication Issues**
   - Verify JWT_SECRET is set in backend
   - Check if tokens are being sent correctly
   - Ensure localStorage is available (client-side only)

### Monitoring

1. **Vercel Analytics**
   - Enable in Vercel Dashboard for performance monitoring

2. **Firebase Monitoring**
   - Use Firebase Console to monitor database usage
   - Set up Firebase Performance Monitoring

3. **Error Tracking**
   - Consider integrating Sentry or similar service
   - Monitor Vercel function logs

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to git
   - Use different Firebase projects for development/production

2. **Firebase Security Rules**
   - Implement proper Firestore security rules
   - Regularly review and update rules

3. **API Security**
   - JWT tokens expire after 7 days
   - Implement rate limiting if needed
   - Use HTTPS only in production

## Cost Optimization

1. **Vercel**
   - Monitor function execution time
   - Use serverless functions efficiently
   - Consider Vercel Pro for better limits

2. **Firebase**
   - Monitor Firestore read/write operations
   - Implement pagination for large datasets
   - Use Firebase free tier limits efficiently

## Scaling Considerations

1. **Database Optimization**
   - Index frequently queried fields
   - Implement pagination
   - Consider data aggregation for analytics

2. **Caching**
   - Implement Redis for session management
   - Use Vercel Edge Caching
   - Cache static product data

3. **CDN**
   - Use Vercel's built-in CDN
   - Optimize images with Next.js Image component
   - Consider using Firebase Storage for file uploads

---

## Quick Reference

### Vercel CLI Commands
```bash
vercel login                 # Login to Vercel
vercel                      # Deploy to preview
vercel --prod               # Deploy to production
vercel env add              # Add environment variable
vercel logs                 # View function logs
```

### Firebase CLI Commands
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
firebase firestore:rules:deploy
```

For support or questions, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)