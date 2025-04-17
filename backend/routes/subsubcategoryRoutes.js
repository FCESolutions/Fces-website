const express = require('express');
const router = express.Router();
const {
    getAllSubsubcategories,
    getSubsubcategoriesBySubcategory,
    getSubsubcategoryById,
    createSubsubcategory,
    updateSubsubcategory,
    deleteSubsubcategory
} = require('../controllers/subsubcategoryController');

// GET all subsubcategories
router.get('/', getAllSubsubcategories);

// GET subsubcategories by subcategory
router.get('/subcategory/:subcategoryId', getSubsubcategoriesBySubcategory);

// GET single subsubcategory
router.get('/:id', getSubsubcategoryById);

// POST new subsubcategory
router.post('/', createSubsubcategory);

// PUT update subsubcategory
router.put('/:id', updateSubsubcategory);

// DELETE subsubcategory
router.delete('/:id', deleteSubsubcategory);

module.exports = router;