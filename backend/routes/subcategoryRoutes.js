const express = require('express');
const router = express.Router();
const {
    getAllSubcategories,
    getSubcategoriesByCategory,
    getSubcategoryById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory
} = require('../controllers/subcategoryController');

// GET all subcategories
router.get('/', getAllSubcategories);

// GET subcategories by category
router.get('/category/:categoryId', getSubcategoriesByCategory);

// GET single subcategory
router.get('/:id', getSubcategoryById);

// POST new subcategory
router.post('/', createSubcategory);

// PUT update subcategory
router.put('/:id', updateSubcategory);

// DELETE subcategory
router.delete('/:id', deleteSubcategory);

module.exports = router;