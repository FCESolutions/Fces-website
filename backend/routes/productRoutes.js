const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductsByLevel,
    getProductsByCategory,
    getProductsBySubcategory,
    getProductsBySubsubcategory,
    getProductById,
} = require('../controllers/productController');

// GET all products
router.get('/', getAllProducts);

// GET products by cat id or sub id or subsub id
router.get('/category/:categoryId/subcategory/:subcategoryId/subsubcategory/:subsubcategoryId', getProductsByLevel);

// GET products by category
router.get('/category/:categoryId', getProductsByCategory);

// GET products by subcategory
router.get('/subcategory/:subcategoryId', getProductsBySubcategory);

// GET products by subsubcategory
router.get('/subsubcategory/:subsubcategoryId', getProductsBySubsubcategory);

// GET single product
router.get('/:id', getProductById);

module.exports = router;