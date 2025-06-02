const express = require('express');
const router = express.Router();
const {
    getAllSubsubcategories,
    getSubsubcategoriesBySubcategory,
    getSubsubcategoryById,
} = require('../controllers/subsubcategoryController');

// GET all subsubcategories
router.get('/', getAllSubsubcategories);

// GET subsubcategories by subcategory
router.get('/subcategory/:subcategoryId', getSubsubcategoriesBySubcategory);

// GET single subsubcategory
router.get('/:id', getSubsubcategoryById);

module.exports = router;