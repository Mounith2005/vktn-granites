const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, templeName, items, notes } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Calculate total running feet
    const totalRunningFeet = items.reduce((sum, item) => sum + (item.runningFeet || 0), 0);

    // Generate order number
    const orderNumber = await Order.generateOrderNumber();

    // Create order
    const order = new Order({
      orderNumber,
      user: req.user._id,
      customerName,
      customerPhone,
      customerAddress,
      templeName,
      items,
      totalRunningFeet,
      notes
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (admin) or user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show user's own orders
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, deliveryDate, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (deliveryDate) order.deliveryDate = deliveryDate;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order (admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/stats/summary
// @desc    Get order statistics (admin only)
// @access  Private/Admin
router.get('/stats/summary', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
