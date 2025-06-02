const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    createNewProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    uploadImgs,
    updateImgDesc,
    deleteImg,
    getProjectImg
} = require('../../controllers/projectsController');

const {
    getProductImage
} = require('../../controllers/productController');

// Define multer inline
const upload = multer({ storage: multer.memoryStorage() });

// create new project
router.post('/', createNewProject);

// update project
router.put('/:id', updateProject);

// update project status
router.put('/:id/status', updateProjectStatus);

// delete project
router.delete('/:id', deleteProject);

// update project image
router.put('/:id/images', upload.array('images'), uploadImgs);

// update image description
router.put('/:projectId/images/:imageId', updateImgDesc);

// delete image from project
router.delete('/:projectId/images/:imageId', deleteImg);

// get images from gridfs
router.get('/images/:id', getProjectImg);

module.exports = router;