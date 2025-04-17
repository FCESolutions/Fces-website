const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductsByCategory,
    getProductsBySubcategory,
    getProductsBySubsubcategory,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// GET all products
router.get('/', getAllProducts);

// GET products by category
router.get('/category/:categoryId', getProductsByCategory);

// GET products by subcategory
router.get('/subcategory/:subcategoryId', getProductsBySubcategory);

// GET products by subsubcategory
router.get('/subsubcategory/:subsubcategoryId', getProductsBySubsubcategory);

// GET single product
router.get('/:id', getProductById);

// POST new product
router.post('/', createProduct);

// PUT update product
router.put('/:id', updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;