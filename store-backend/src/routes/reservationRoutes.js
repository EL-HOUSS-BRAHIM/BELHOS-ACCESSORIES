const express = require('express');
const {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', authenticateToken, createReservation);
router.get('/my-reservations', authenticateToken, getUserReservations);
router.delete('/:id', authenticateToken, deleteReservation);

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllReservations);
router.put('/:id', authenticateToken, isAdmin, updateReservationStatus);

module.exports = router;
