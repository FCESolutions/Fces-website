const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} = require('../../controllers/orderController');

// GET all orders (for admin)
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// PUT update order status (for admin)
router.put('/:orderId/status', updateOrderStatus);

// DELETE order (for admin)
router.delete('/:orderId', deleteOrder);

module.exports = router;