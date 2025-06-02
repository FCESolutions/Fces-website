const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const { getGFSBucket } = require('../config/gridfs');
const path = require('path');

const storage = new multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

const uploadToGridFS = (req, res, next) => {
  if (!req.file) return next();

  const bucket = getGFSBucket();
  const filename = `${Date.now()}-${req.file.originalname}`;
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype
    });

    // Store file reference for error handling
    req.file.uploadStream = uploadStream;

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      reject(new Error('File upload failed'));
    });

    uploadStream.on('finish', () => {
      // Get the file ID from the upload stream
      req.file.id = uploadStream.id;
      resolve();
    });

    uploadStream.end(req.file.buffer);
  })
  .then(() => next())
  .catch(error => {
    console.error('Upload failed:', error);
    return res.status(500).json({ 
      message: error.message || 'File upload failed',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  });
};

module.exports = {
  single: (fieldName) => [upload.single(fieldName), uploadToGridFS]
};