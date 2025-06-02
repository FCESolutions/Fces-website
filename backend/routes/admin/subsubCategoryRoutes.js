const express = require('express');
const router = express.Router();

const {
    createSubsubcategory,
    updateSubsubcategory,
    deleteSubsubcategory
} = require('../../controllers/subsubcategoryController');


// POST new subsubcategory
router.post('/', createSubsubcategory);

// PUT update subsubcategory
router.put('/:id', updateSubsubcategory);

// DELETE subsubcategory
router.delete('/:id', deleteSubsubcategory);

module.exports = router;