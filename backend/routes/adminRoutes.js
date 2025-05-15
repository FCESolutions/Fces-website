const express = require('express');
const router = express.Router();

const {
    checkAdmin,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} = require('../controllers/orderController');

const {
    updateProductStock,
} = require('../controllers/productController');

// Check admin password
router.post('/admin-access', checkAdmin);

// GET all orders (for admin)
router.get('/orders', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// PUT update order status (for admin)
router.put('/:orderId/status', updateOrderStatus);

// DELETE order (for admin)
router.delete('/:orderId', deleteOrder);

// PUT update order stock (for admin)
router.put('/:id/stock', updateProductStock);

module.exports = router;