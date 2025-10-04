const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');

const verifyAdmin = (req) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      throw new Error('Admin access required');
    }
    return decoded;
  } catch (error) {
    if (error.message === 'Admin access required') {
      throw error;
    }
    throw new Error('Invalid token');
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    verifyAdmin(req);

    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    const allowedRoles = ['USER', 'ADMIN'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await User.update(userId, { role });
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Role updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);

    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: error.message });
    }

    if (error.message === 'Admin access required') {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: 'Server error while assigning role' });
  }
};
