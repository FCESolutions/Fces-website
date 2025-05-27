const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  description: String,
  imageId: mongoose.Schema.Types.ObjectId, // Reference to GridFS file
  hash: String // 🔒 For duplicate content detection
});

const projectSchema = new Schema({
  title: { type: String, required: true },
  images: [imageSchema],
  isInProgress: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);