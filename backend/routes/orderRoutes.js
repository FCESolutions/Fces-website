const express = require('express');
const router = express.Router();

const {
    getOrderById,
    createOrder
} = require('../controllers/orderController');

// Get order by ID
router.get('/:id', getOrderById);

// POST new order
router.post('/', createOrder);

module.exports = router;

