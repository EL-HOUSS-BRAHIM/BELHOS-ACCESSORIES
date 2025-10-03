const Reservation = require('../../src/models/Reservation');
const Product = require('../../src/models/Product');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for serverless functions
const verifyToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const decoded = verifyToken(req);
    
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, decoded);
      case 'POST':
        return await handlePost(req, res, decoded);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

async function handleGet(req, res, decoded) {
  // Admin can see all reservations, users can only see their own
  if (decoded.role === 'ADMIN') {
    const reservations = await Reservation.findAll();
    return res.json(reservations);
  } else {
    const reservations = await Reservation.findByUser(decoded.id);
    return res.json(reservations);
  }
}

async function handlePost(req, res, decoded) {
  const { productId, quantity } = req.body;
  const userId = decoded.id;

  // Check if product exists and has enough stock
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  // Create reservation
  const reservation = await Reservation.create({
    userId,
    productId,
    quantity: parseInt(quantity),
    status: 'pending'
  });

  // Update product stock
  await Product.updateStock(productId, -quantity);

  // Get the complete reservation with product details
  const completeReservation = await Reservation.findById(reservation.id);

  res.status(201).json({ message: 'Reservation created', reservation: completeReservation });
}