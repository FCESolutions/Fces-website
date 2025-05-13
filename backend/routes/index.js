const express = require('express');
const router = express.Router();

// Import all route files
const categoryRoutes = require('./categoryRoutes');
const subcategoryRoutes = require('./subcategoryRoutes');
const subsubcategoryRoutes = require('./subsubcategoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');

// Use the routes

router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/subsubcategories', subsubcategoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);


module.exports = router;