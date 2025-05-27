const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subsubcategorySchema = new Schema({
  subsubcategory_name: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  category_name: { type: String },
  subcategory_id: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  subcategory_name: { type: String },
  subsubcategory_image_url: { type: String },
  last_updated: { type: Date, default: Date.now },
  scraped_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subsubcategory', subsubcategorySchema);