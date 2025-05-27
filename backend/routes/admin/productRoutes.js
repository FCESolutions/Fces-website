const express = require('express');
const router = express.Router();

const {
    createProduct,
    updateProduct,
    deleteProduct
} = require('../../controllers/productController');

// POST new product
router.post('/', createProduct);

// PUT update product
router.put('/:id', updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;