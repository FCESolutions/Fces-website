const express = require('express');
const router = express.Router();

const {
    createSubcategory,
    updateSubcategory,
    deleteSubcategory
} = require('../../controllers/subcategoryController');


// POST new subcategory
router.post('/', createSubcategory);

// PUT update subcategory
router.put('/:id', updateSubcategory);

// DELETE subcategory
router.delete('/:id', deleteSubcategory);

module.exports = router;