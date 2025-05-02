const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

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
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'paymentStatus'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!order) {
        return res.status(404).send();
      }
      
      res.send(order);
    } catch (error) {
      res.status(400).send(error);
    }
};