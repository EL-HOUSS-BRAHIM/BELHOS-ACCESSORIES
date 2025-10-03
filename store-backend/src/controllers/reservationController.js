const prisma = require('../utils/prisma');

// Create reservation
const createReservation = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        productId: parseInt(productId),
        quantity,
        status: 'pending'
      },
      include: {
        product: true
      }
    });

    // Update product stock
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { stock: product.stock - quantity }
    });

    res.status(201).json({ message: 'Reservation created', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating reservation' });
  }
};

// Get user reservations
const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching reservations' });
  }
};

// Get all reservations (Admin only)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

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

    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        product: true,
        user: true
      }
    });

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

    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: { product: true }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Only owner or admin can delete
    if (reservation.userId !== userId && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Restore stock
    await prisma.product.update({
      where: { id: reservation.productId },
      data: { stock: reservation.product.stock + reservation.quantity }
    });

    await prisma.reservation.delete({
      where: { id: parseInt(id) }
    });

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
