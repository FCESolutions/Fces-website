const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


exports.checkAdmin = async (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_SECRET_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  Order.find().sort({ createdAt: -1 }).then(orders => {
    res.json(orders);
  }).catch(err => res.status(500).json({ error: 'Failed to fetch orders' }));
};

// Get all orders (for admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).send();
      }
      res.send(order);
    } catch (error) {
      res.status(500).send(error);
    }
};

// create a new order
exports.createOrder =  async (req, res) => {
    try {
      const order = new Order(req.body);
      await order.save();
      res.status(201).send(order);
    } catch (error) {
      res.status(400).send(error);
    }
};

// Update order status (for admin)
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Status updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete order (for admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log('Order deleted:', order);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};