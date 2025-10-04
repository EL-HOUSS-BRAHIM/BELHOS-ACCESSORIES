const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const defaultOrigins = ['http://localhost:3000'];
const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
]
  .filter(Boolean)
  .flatMap((value) => value.split(',').map((origin) => origin.trim()))
  .filter((origin) => origin.length > 0);

const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

const allowedOrigins = Array.from(
  new Set([
    ...defaultOrigins,
    ...envOrigins,
    vercelOrigin,
  ].filter(Boolean)),
);

const isOriginAllowed = (origin) =>
  allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === '*') {
      return true;
    }

    if (allowedOrigin.includes('*')) {
      const [prefix, suffix] = allowedOrigin.split('*');
      return origin.startsWith(prefix) && origin.endsWith(suffix);
    }

    return allowedOrigin === origin;
  });

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
