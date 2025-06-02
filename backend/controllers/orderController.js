const express = require('express');
const Order = require('../models/Order');
const nodemailer = require('nodemailer')
require('dotenv').config();
const GridFSController = require('./gridfsController'); 
const mongoose = require('mongoose');
const gridFs = new GridFSController();
const jwt = require('jsonwebtoken');

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

  try {
    // Generate JWT token
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // valid for 2 hours
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all orders (for admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.send(orders);
    } catch (error) {
        console.error(error);
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
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    let attachments = [];
    let imageCid = null;

    const firstItem = order.items[0];

    if (firstItem) {
      const fileId = firstItem.productImageFile?.fileId;

      if (fileId) {
        try {
          const fileObjectId = new mongoose.Types.ObjectId(fileId);
          const fileInfo = await gridFs.getFileInfo(fileObjectId);

          if (fileInfo) {
            const downloadStream = gridFs.bucket.openDownloadStream(fileObjectId);

            attachments.push({
              filename: fileInfo.filename,
              content: downloadStream,
              contentType: fileInfo.contentType,
              cid: 'productimage@fces'
            });

            imageCid = 'productimage@fces';
          }
        } catch (err) {
          console.error('Error attaching image:', err.message);
        }
      }
    }

    // Build the image HTML, fallback to image_url if no file attachment
    let productImageHTML = '<p>Aucune image disponible.</p>';
    if (imageCid) {
      productImageHTML = `<img src="cid:${imageCid}" alt="Produit" style="max-width: 200px; border: 1px solid #ccc; padding: 5px;" />`;
    } else if (firstItem?.productImage) {
      productImageHTML = `<img src="${firstItem.productImage}" alt="Produit" style="max-width: 200px; border: 1px solid #ccc; padding: 5px;" />`;
    }

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
        <p><strong>Nom:</strong> ${firstItem.productName}</p>
        ${productImageHTML}

        <hr/>
        <p style="color: #888;">Cet email vous a été envoyé automatiquement depuis le site FCES.</p>
      `,
      attachments
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error('Email sending failed:', mailErr.message);
    }

    res.status(201).send(order);
  } catch (error) {
    console.error("Order creation error:", error);
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
