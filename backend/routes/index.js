const express = require('express');
const router = express.Router();

// Import all route files
const categoryRoutes = require('./categoryRoutes');
const subcategoryRoutes = require('./subcategoryRoutes');
const subsubcategoryRoutes = require('./subsubcategoryRoutes');
const productRoutes = require('./productRoutes');

// Use the routes
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/subsubcategories', subsubcategoryRoutes);
router.use('/products', productRoutes);

module.exports = router;