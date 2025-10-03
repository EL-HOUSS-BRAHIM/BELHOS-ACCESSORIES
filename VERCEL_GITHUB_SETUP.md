# 🚀 Quick Deployment Guide

## Automatic GitHub + Vercel Deployment

### 1. **Link Repository to Vercel**

#### For Frontend:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `EL-HOUSS-BRAHIM/BELHOS-ACCESSORIES`
4. Set Root Directory to: `store-frontend`
5. Framework Preset: Next.js
6. Deploy!

#### For Backend:
1. Create another project in Vercel Dashboard
2. Import same GitHub repo: `EL-HOUSS-BRAHIM/BELHOS-ACCESSORIES`
3. Set Root Directory to: `store-backend`
4. Framework Preset: Other
5. Deploy!

### 2. **Set Up Firebase**

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create project: "belhos-accessories"
   - Enable Firestore Database
   - Enable Authentication (Email/Password)

2. **Get Firebase Config**
   - Project Settings → General → Your apps → Web app
   - Copy the config object

3. **Get Service Account**
   - Project Settings → Service accounts
   - Generate new private key (downloads JSON file)

### 3. **Update Environment Variables**

1. **Frontend (.env.production)**
   ```bash
   # Replace with your Firebase config
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

2. **Backend (.env.production)**
   ```bash
   # Replace with your service account JSON (as one line)
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   
   # Generate a strong random string (minimum 32 characters)
   JWT_SECRET=your_random_jwt_secret_here
   ```

### 4. **Deploy**

Simply push to GitHub and Vercel will auto-deploy:

```bash
git add .
git commit -m "Configure production deployment"
git push origin main
```

### 5. **Test Your Application**

- **Frontend**: Your Vercel frontend URL
- **Backend**: Your Vercel backend URL + `/api/products`

### 🔐 **Security Notes**

**Environment Variables in Public Repo:**
- `.env.production` files are included for convenience
- **IMPORTANT**: Replace placeholder values with real ones
- For extra security, set env vars directly in Vercel Dashboard instead

**Alternative (More Secure):**
1. Keep `.env.production` files with placeholders
2. Set real values in Vercel Dashboard → Project Settings → Environment Variables
3. Add to gitignore: `.env.production`

---

## Current Deployment URLs

- **Frontend**: https://store-frontend-b6ep7yp15-bross-projects-17a2e313.vercel.app
- **Backend**: https://store-backend-cu36qfd27-bross-projects-17a2e313.vercel.app

Once you link to GitHub, these will update automatically on every push!