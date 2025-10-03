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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function handleGet(req, res) {
  const { category, minPrice, maxPrice, orderBy, order, limit } = req.query;
  
  const options = {};
  if (category) options.category = category;
  if (orderBy) {
    options.orderBy = orderBy;
    options.order = order || 'asc';
  }
  if (limit) options.limit = parseInt(limit);

  let products = await Product.findAll(options);
  
  // Apply price filtering after fetching (since Firebase doesn't support complex queries)
  if (minPrice || maxPrice) {
    products = products.filter(product => {
      if (minPrice && product.price < parseFloat(minPrice)) return false;
      if (maxPrice && product.price > parseFloat(maxPrice)) return false;
      return true;
    });
  }

  res.json(products);
}

async function handlePost(req, res) {
  // Verify admin access
  const decoded = verifyToken(req);
  if (decoded.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { name, description, price, imageUrl, category, stock } = req.body;

  const product = await Product.create({
    name, 
    description, 
    price: parseFloat(price), 
    imageUrl, 
    category, 
    stock: parseInt(stock) || 0
  });

  res.status(201).json({ message: 'Product created', product });
}