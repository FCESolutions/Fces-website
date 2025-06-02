const express = require('express');
const router = express.Router();

const {
    createCategory,
    updateCategory,
    deleteCategory
} = require('../../controllers/categoryController');

// POST new category
router.post('/', createCategory);

// PUT update category
router.put('/:id', updateCategory);

// DELETE category
router.delete('/:id', deleteCategory);

module.exports = router;