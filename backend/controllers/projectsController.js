// routes/projects.js
const express = require('express');
//const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
//const { connectToGridFS } = require('../config/gridfs');
const { getGFSBucket } = require('../config/gridfs');

//const upload = multer({ storage: multer.memoryStorage() });

const crypto = require('crypto');

// Connect to GridFS
/*
let gfs;
connectToGridFS().then((gridFS) => {
  gfs = gridFS;
});
*/

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new project
exports.createNewProject = async (req, res) => {
  const project = new Project({
    title: req.body.title,
    isInProgress: req.body.isInProgress || false
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        title: req.body.title,
        isInProgress: req.body.isInProgress,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update project status
exports.updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isInProgress: req.body.isInProgress },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    // First delete all associated images from GridFS
    const project = await Project.findById(req.params.id);
    if (project && project.images.length > 0) {
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
      });
      
      for (const image of project.images) {
        await bucket.delete(new mongoose.Types.ObjectId(image.imageId));
      }
    }
    
    // Then delete the project
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload images to a project
exports.uploadImgs = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const bucket = getGFSBucket();

    const uploadedImages = [];
    const skippedImages = [];

    for (const file of req.files) {
      const hash = crypto.createHash('md5').update(file.buffer).digest('hex');
  
      const alreadyExists = project.images.some(img => img.hash === hash);
      if (alreadyExists) {
        console.log(`Skipping duplicate content: ${file.originalname}`);
        skippedImages.push(file.originalname);
        continue;
      }

      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      uploadStream.end(file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });

      uploadedImages.push({
        filename: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        imageId: uploadStream.id,
        hash,
      });
    }

    project.images.push(...uploadedImages);
    await project.save();

    res.status(201).json({
      uploadedImages,
      skippedImages,
      message: skippedImages.length
        ? `Some files were skipped due to duplication: ${skippedImages.join(', ')}`
        : 'All files uploaded successfully'
    });
  } catch (err) {
    console.error('Upload error:', err); 
    res.status(500).json({ message: err.message });
  }
};

// Update image description
exports.updateImgDesc = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const image = project.images.find(
      img => img.imageId.toString() === req.params.imageId
    );

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (!req.body.description) {
      console.log('Description is required');
      return res.status(400).json({ message: 'Description is required' });
    }
    image.description = req.body.description;
    await project.save();
    
    res.json(image);
  } catch (err) {
    console.log('Error updating image description:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete image from project
exports.deleteImg = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const imageIndex = project.images.findIndex(
      img => img.imageId.toString() === req.params.imageId
    );
    
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from GridFS
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    
    await bucket.delete(new mongoose.Types.ObjectId(req.params.imageId));
    
    // Remove from project
    project.images.splice(imageIndex, 1);
    await project.save();
    
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Serve images from GridFS
// Serve images from GridFS with proper headers
exports.getImgsFromGridFS = async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    // First find the file metadata to get content type
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    const file = files[0];
    
    // Set proper headers
    res.set('Content-Type', file.contentType);
    res.set('Content-Length', file.length);
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    
    // Enable CORS if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on('error', () => {
      res.status(404).json({ message: 'Image not found' });
    });
    
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ message: err.message });
  }
};
