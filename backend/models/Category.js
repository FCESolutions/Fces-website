const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category_name: { type: String, required: true, unique: true },
  category_url: { type: String, required: true },
  category_image_url: { type: String },
  scraped_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);