const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    checkAdmin
} = require('../controllers/orderController');

const {
    updateProductStock,
} = require('../controllers/productController');

const orderRoutes = require('./admin/orderRoutes');
const projectRoutes = require('./admin/projectRoutes');
const productRoutes = require('./admin/productRoutes');

// Check admin password
router.post('/admin-access', checkAdmin);

// Apply admin protection middleware to all subroutes
router.use('/orders', orderRoutes);
router.use('/projects', projectRoutes);
router.use('/products', productRoutes);

// PUT update order stock (for admin)
router.put('/:id/stock', updateProductStock);

module.exports = router;