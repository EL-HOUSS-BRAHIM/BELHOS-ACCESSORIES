const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER'
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const initAdminAccount = async (req, res) => {
  try {
    const existingAdmin = await User.findFirstByRole('ADMIN');

    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin account already exists' });
    }

    const baseEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@belhos-accessories.local';
    let adminEmail = baseEmail;

    const existingUserWithEmail = await User.findByEmail(adminEmail);
    if (existingUserWithEmail) {
      const [localPart, domain = 'example.com'] = baseEmail.split('@');
      adminEmail = `${localPart}+${Date.now()}@${domain}`;
    }

    const rawPassword = crypto.randomBytes(8).toString('hex');

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const adminUser = await User.create({
      name: 'Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    });

    const { password: _, ...adminWithoutPassword } = adminUser;

    return res.status(201).json({
      message: 'Admin account created successfully',
      credentials: {
        email: adminEmail,
        password: rawPassword
      },
      user: adminWithoutPassword
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error initializing admin account' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      message: 'Login successful', 
      token, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, getCurrentUser, initAdminAccount };
