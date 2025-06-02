const express = require('express');
const router = express.Router();

const {
    getImage
} = require('../controllers/imagesController');

// GET image by ID
router.get('/:id', getImage);

module.exports = router;