const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer')
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

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

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Nouvelle commande reçue',
        html: `
          <h2>Nouvelle commande reçue</h2>
          <p><strong>Nom du client:</strong> ${order.customer.name}</p>
          <p><strong>Email:</strong> ${order.customer.email || 'Non fourni'}</p>
          <p><strong>Téléphone:</strong> ${order.customer.phone}</p>

          <h3>Produit commandé</h3>
          <p><strong>Nom:</strong> ${order.items[0].productName}</p>
          ${
            order.items[0].productImage
              ? `<img src="${order.items[0].productImage}" alt="Produit" style="max-width: 200px; border: 1px solid #ccc; padding: 5px;" />`
              : '<p>Aucune image disponible.</p>'
          }

          <hr/>
          <p style="color: #888;">Cet email vous a été envoyé automatiquement depuis le site FCES.</p>
        `
      };

      await transporter.sendMail(mailOptions)

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
