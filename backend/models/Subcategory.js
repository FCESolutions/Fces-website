const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  subcategory_name: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  category_name: { type: String },
  subcategory_image_url: { type: String },
  last_updated: { type: Date, default: Date.now },
  scraped_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subcategory', subcategorySchema);