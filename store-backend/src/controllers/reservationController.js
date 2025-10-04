const Reservation = require('../models/Reservation');
const Product = require('../models/Product');

// Create reservation
const createReservation = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const normalizedQuantity = parsedQuantity;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < normalizedQuantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Create reservation
    const reservation = await Reservation.create({
      userId,
      productId,
      quantity: normalizedQuantity,
      status: 'pending'
    });

    // Update product stock
    await Product.updateStock(productId, -normalizedQuantity);

    // Get the complete reservation with product details
    const completeReservation = await Reservation.findById(reservation.id);

    res.status(201).json({ message: 'Reservation created', reservation: completeReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating reservation' });
  }
};

// Get user reservations
const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await Reservation.findByUser(userId);

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching reservations' });
  }
};

// Get all reservations (Admin only)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching reservations' });
  }
};

// Update reservation status (Admin only)
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.updateStatus(id, status);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation updated', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating reservation' });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting reservation' });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation
};
