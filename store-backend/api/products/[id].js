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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, id);
      case 'PUT':
        return await handlePut(req, res, id);
      case 'DELETE':
        return await handleDelete(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function handleGet(req, res, id) {
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
}

async function handlePut(req, res, id) {
  // Verify admin access
  const decoded = verifyToken(req);
  if (decoded.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const updateData = req.body;
  
  // Parse numeric fields
  if (updateData.price !== undefined) {
    updateData.price = Number.parseFloat(updateData.price);
  }
  if (updateData.stock !== undefined) {
    updateData.stock = Number.parseInt(updateData.stock, 10);
  }

  const product = await Product.update(id, updateData);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ message: 'Product updated', product });
}

async function handleDelete(req, res, id) {
  // Verify admin access
  const decoded = verifyToken(req);
  if (decoded.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const success = await Product.delete(id);

  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully' });
}