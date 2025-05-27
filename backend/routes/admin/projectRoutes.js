const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    getAllProjects,
    createNewProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    uploadImgs,
    updateImgDesc,
    deleteImg,
    getImgsFromGridFS
} = require('../../controllers/projectsController');

// Define multer inline
const upload = multer({ storage: multer.memoryStorage() });

// get all projects
router.get('/', getAllProjects);

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
router.get('/images/:id', getImgsFromGridFS);

module.exports = router;