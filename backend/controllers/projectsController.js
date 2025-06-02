// routes/projects.js
const express = require('express');
//const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { getGFSBucket } = require('../config/gridfs');
const GridFSController = require('../controllers/gridfsController');
const gridFS = new GridFSController();

const crypto = require('crypto');

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

      const uploadedFile = await gridFS.uploadFile(file, { generateHash: true });

      uploadedImages.push({
        filename: uploadedFile.filename,
        contentType: uploadedFile.contentType,
        size: uploadedFile.size,
        imageId: uploadedFile.fileId,
        hash: uploadedFile.hash,
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
    
    // Delete from GridFS using the controller
    await gridFS.deleteFile(req.params.imageId);
    
    // Remove from project
    project.images.splice(imageIndex, 1);
    await project.save();
    
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Serve images from GridFS with proper headers
exports.getProjectImg = async (req, res) => {
  try {
    await gridFS.streamFile(req.params.id, res, {
      cacheControl: 'public, max-age=31536000' // 1 year cache
    });
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ message: err.message });
  }
};
