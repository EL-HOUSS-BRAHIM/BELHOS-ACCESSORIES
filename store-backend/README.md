# BELHOS ACCESSORIES - Backend API

Backend API for the BELHOS ACCESSORIES e-commerce platform built with Node.js, Express, and Firebase Admin SDK backed by Firestore.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Google Firestore via Firebase Admin SDK
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **CORS**: cors middleware

## 🔌 Firebase Admin & Firestore Setup

The backend uses the Firebase Admin SDK to talk to Firestore. Initialization happens in [`src/config/firebase.js`](src/config/firebase.js), which looks for a service-account credential at boot time:

1. **Create a Firebase service account** with the "Editor" role (or Firestore access) in the [Firebase Console](https://console.firebase.google.com/).
2. **Download the service-account JSON** and keep it secure.
3. **Provide credentials to the API** in one of two ways:
   - **Environment variable**: set `FIREBASE_SERVICE_ACCOUNT_KEY` to the full JSON string of the service account and `FIREBASE_DATABASE_URL` to your Firebase Realtime Database/Firestore URL. This is the method used in serverless (Vercel) deployments.
   - **Default credentials**: when running locally you may instead point `GOOGLE_APPLICATION_CREDENTIALS` at the JSON file so the Admin SDK picks it up automatically. In this case leave `FIREBASE_SERVICE_ACCOUNT_KEY` unset and the app will fall back to `admin.initializeApp()`.

The Admin SDK exports a Firestore client (`db`) and Auth client (`auth`) that are consumed by the model layer:

- [`src/models/User.js`](src/models/User.js)
- [`src/models/Product.js`](src/models/Product.js)
- [`src/models/Reservation.js`](src/models/Reservation.js)

These models wrap Firestore collections and are shared by both the Express server and the Vercel serverless handlers.

## 📁 Project Structure

```
store-backend/
├── api/                     # Vercel serverless function entry points
│   ├── auth/
│   ├── products/
│   └── reservations/
├── src/
│   ├── config/
│   │   └── firebase.js      # Firebase Admin bootstrap
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js            # Express entry point for local dev / Node hosting
├── .env                     # Local environment variables (not committed)
├── package.json
└── vercel.json              # Serverless deployment configuration
```

## ⚙️ Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT signing | ✅ | `super-secret-jwt` |
| `PORT` | Local server port (Express) | ➖ | `5000` |
| `NODE_ENV` | Environment mode | ➖ | `development` |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | JSON string of service-account credentials | ✅ (Vercel) / ➖ (local default credentials) | `{ "type": "service_account", ... }` |
| `FIREBASE_DATABASE_URL` | Firebase database URL used during Admin init | ✅ when using `FIREBASE_SERVICE_ACCOUNT_KEY` | `https://<project-id>.firebaseio.com` |
| `GOOGLE_APPLICATION_CREDENTIALS` | File path to service-account JSON (local only) | ➖ | `/path/to/serviceAccount.json` |

> **Tip:** When copying the JSON into `FIREBASE_SERVICE_ACCOUNT_KEY`, escape double quotes or use single quotes in your `.env` file.

## 🚀 Quick Start (Local Express Server)

1. **Install dependencies**
   ```bash
   pnpm install   # or npm install / yarn install
   ```
2. **Create `.env`** (see environment variables above).
   - If you prefer file-based credentials locally, set `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccount.json` and omit `FIREBASE_SERVICE_ACCOUNT_KEY`.
   - Otherwise, paste the JSON into `FIREBASE_SERVICE_ACCOUNT_KEY` and set `FIREBASE_DATABASE_URL`.
3. **Start the development server**
   ```bash
   pnpm dev
   ```
   The Express server defined in [`src/server.js`](src/server.js) will boot on `http://localhost:5000` and expose the REST API.

For a production-style run, use:
```bash
pnpm start
```

## ☁️ Deploying to Vercel

- The `vercel.json` file maps API routes to the handlers inside the `/api` directory.
- Each handler imports the same Firestore-backed models, so ensure the following environment variables are set in your Vercel project settings:
  - `FIREBASE_SERVICE_ACCOUNT_KEY`
  - `FIREBASE_DATABASE_URL`
  - `JWT_SECRET`
- Deploy via the Vercel dashboard or CLI; no build step is required (`vercel-build` is a no-op).

## 🔁 Shared Architecture

- **Express entry point**: [`src/server.js`](src/server.js) wires up middleware and routes for local development or traditional Node hosting.
- **Serverless entry points**: `/api/*` files (e.g., [`api/products/index.js`](api/products/index.js)) export handlers compatible with Vercel. They configure CORS headers manually and reuse the same model operations as the Express routes/controllers.
- **Model layer**: Firestore collection accessors located in [`src/models`](src/models) provide CRUD operations for users, products, and reservations.

## 📋 API Endpoints

Authentication, product, and reservation routes are exposed under `/api`. Key examples:

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Reservations
- `GET /api/reservations` (admin)
- `GET /api/reservations/my-reservations`
- `POST /api/reservations`
- `PUT /api/reservations/:id` (admin)
- `DELETE /api/reservations/:id`

Responses follow the JSON structures defined in the respective controllers/models.

## 🔐 Security Best Practices

- Passwords hashed with bcrypt (10 salt rounds).
- JWT tokens with seven-day expiration.
- CORS configured for the frontend origin in `src/server.js`.
- Environment variables keep secrets out of the codebase.
- Role-based access control enforced in middleware and serverless handlers.

## 🧰 Useful Scripts

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "vercel-build": "echo 'Build complete'"
}
```

## 🩺 Health Check

Visit `GET /health` locally to confirm the Express server is running. On Vercel, `api/health.js` serves the same purpose.

## 📄 License

This project is for educational purposes.
