const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getAllCategoriesWithSubcategories,
    getCategoryById,
    searchItem,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// GET all categories
router.get('/', getAllCategories);

// GET categories with subcategories and subsubcategories
router.get('/SideBar', getAllCategoriesWithSubcategories);

// GET single category
router.get('/:id', getCategoryById);

// Search bar
router.get('/search', searchItem);

// POST new category
router.post('/', createCategory);

// PUT update category
router.put('/:id', updateCategory);

// DELETE category
router.delete('/:id', deleteCategory);

module.exports = router;