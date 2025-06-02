const express = require('express');
const router = express.Router();

const {
    getAllProjects,
    getProjectImg
} = require('../controllers/projectsController');

// get all projects
router.get('/', getAllProjects);

// get images from gridfs
router.get('/images/:id', getProjectImg);

module.exports = router;