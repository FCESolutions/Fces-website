const mongoose = require('mongoose');
const { getGFSBucket } = require('../config/gridfs');
const crypto = require('crypto');

class GridFSController {
  constructor() {
    this.bucket = getGFSBucket(); // Already pre-configured
  }

  // Upload single file
  async uploadFile(file, options = {}) {
    const uploadStream = this.bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      ...options
    });

    uploadStream.end(file.buffer);

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve({
          filename: file.originalname,
          contentType: file.mimetype,
          size: file.size,
          fileId: uploadStream.id,
          // Add hash for duplicate detection if needed
          hash: options.generateHash 
            ? crypto.createHash('md5').update(file.buffer).digest('hex')
            : undefined
        });
      });
      uploadStream.on('error', reject);
    });
  }

  // Upload multiple files
  async uploadFiles(files, options = {}) {
    const uploadResults = [];
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, options);
        uploadResults.push(result);
      } catch (err) {
        uploadResults.push({ error: err.message, filename: file.originalname });
      }
    }
    return uploadResults;
  }

  // Delete file by ID
  async deleteFile(fileId) {
    try {
      await this.bucket.delete(new mongoose.Types.ObjectId(fileId));
      return { success: true, fileId };
    } catch (err) {
      return { success: false, error: err.message, fileId };
    }
  }

  // Get file metadata
  async getFileInfo(fileId) {
    const files = await this.bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    return files[0] || null;
  }

  // Stream file to response
  async streamFile(fileId, res, options = {}) {
    try {
      const file = await this.getFileInfo(fileId);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Set headers
      res.set('Content-Type', file.contentType);
      res.set('Content-Length', file.length);
      if (options.cacheControl) {
        res.set('Cache-Control', options.cacheControl);
      }

      // Enable CORS if needed
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

      // Stream file
      const downloadStream = this.bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
      downloadStream.pipe(res);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = GridFSController;