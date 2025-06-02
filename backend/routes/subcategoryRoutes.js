const express = require('express');
const router = express.Router();
const {
    getAllSubcategories,
    getSubcategoriesByCategory,
    getSubcategoryById
} = require('../controllers/subcategoryController');

// GET all subcategories
router.get('/', getAllSubcategories);

// GET subcategories by category
router.get('/category/:categoryId', getSubcategoriesByCategory);

// GET single subcategory
router.get('/:id', getSubcategoryById);

module.exports = router;