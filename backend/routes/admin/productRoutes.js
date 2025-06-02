const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');
const { single } = require('../../middleware/upload');

const {
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    getProductImage,
    updateProductStock,
} = require('../../controllers/productController');

// POST new product
router.post('/', single('product_image'), createProduct);

// PUT update product
router.put('/:id', upload.single('product_image'), updateProduct);

// PUT update product stock (for admin)
router.put('/:id/stock', updateProductStock);

// DELETE product
router.delete('/:id', deleteProduct);

// Upload product image
router.post('/upload', upload.single('product_image'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }
  next();
}, uploadProductImage);

// Get product image
router.get('/images/:id', getProductImage);

module.exports = router;