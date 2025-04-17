const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const descriptionItemSchema = new Schema({
  type: { type: String, enum: ['heading', 'paragraph', 'bullet_list'], required: true },
  content: { type: String }, // For heading and paragraph
  items: [{ type: String }] // For bullet_list
});

const externalLinkSchema = new Schema({
  label: { type: String },
  text: { type: String },
  url: { type: String },
  type: { type: String, enum: ['certificate', 'external_resource'] }
});

const productFileSchema = new Schema({
  label: { type: String },
  url: { type: String },
  type: { type: String, enum: ['pdf', 'other'] }
});

const productSchema = new Schema({
  name: { type: String, required: true },
  product_name: { type: String },
  primary_url: { type: String, required: true },
  source_url: { type: String },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  category_name: { type: String, required: true },
  subcategory_id: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  subcategory_name: { type: String },
  subsubcategory_id: { type: Schema.Types.ObjectId, ref: 'Subsubcategory' },
  description: [descriptionItemSchema],
  specifications: { type: Map, of: String }, // Flexible specs structure
  price: { type: String },
  main_image_url: { type: String },
  product_image_url: { type: String },
  external_links: [externalLinkSchema],
  product_files: [productFileSchema],
  scraped: { type: Boolean, default: false },
  scraped_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);