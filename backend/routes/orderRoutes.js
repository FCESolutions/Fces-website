const express = require('express');
const router = express.Router();

const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
} = require('../controllers/orderController');

// GET all orders (for admin)
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// POST new order
router.post('/', createOrder);

// PUT update order status (for admin)
router.put('/:id', updateOrderStatus);

module.exports = router;