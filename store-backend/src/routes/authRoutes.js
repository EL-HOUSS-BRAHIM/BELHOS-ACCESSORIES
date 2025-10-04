const express = require('express');
const { register, login, getCurrentUser, assignRole } = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/assign-role', authenticateToken, isAdmin, assignRole);

module.exports = router;
