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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    const decoded = verifyToken(req);
    
    switch (req.method) {
      case 'PUT':
        return await handlePut(req, res, id, decoded);
      case 'DELETE':
        return await handleDelete(req, res, id, decoded);
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

async function handlePut(req, res, id, decoded) {
  const { status } = req.body;

  // Only admin can update reservation status
  if (decoded.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const reservation = await Reservation.updateStatus(id, status);

  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  res.json({ message: 'Reservation updated', reservation });
}

async function handleDelete(req, res, id, decoded) {
  const userId = decoded.id;
  const isAdmin = decoded.role === 'ADMIN';

  const reservation = await Reservation.findById(id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  // Only owner or admin can delete
  if (reservation.userId !== userId && !isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Restore stock
  await Product.updateStock(reservation.productId, reservation.quantity);

  await Reservation.delete(id);

  res.json({ message: 'Reservation deleted successfully' });
}