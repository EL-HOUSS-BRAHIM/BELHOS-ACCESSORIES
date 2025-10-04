const express = require('express');
const {
  register,
  login,
  getCurrentUser,
  initAdminAccount,
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/init-admin', initAdminAccount);

module.exports = router;
