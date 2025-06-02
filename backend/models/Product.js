const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const descriptionItemSchema = new Schema({
  type: { type: String, enum: ['heading', 'paragraph', 'bullet_list'], required: true },
  content: { type: String }, // For heading and paragraph
  items: [{ type: String }] // For bullet_list
});

const externalLinkSchema = new Schema({
  label: { type: String },
  url: { type: String },
  type: { type: String, enum: ['certificate', 'external_resource'] }
});

const productFileSchema = new Schema({
  label: { type: String },
  url: { type: String },
  type: { type: String, enum: ['pdf', 'other'] }
});

const productSchema = new Schema({
  product_name: { type: String },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  category_name: { type: String, required: true },
  subcategory_id: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  subcategory_name: { type: String },
  subsubcategory_id: { type: Schema.Types.ObjectId, ref: 'Subsubcategory' },
  description: [descriptionItemSchema],
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  marque: { type: String },
  product_image_url: { type: String },
  product_image_file: {
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
    mimetype: String,
    size: Number
  },
  external_links: [externalLinkSchema],
  product_files: [productFileSchema],
  stock: { type: Number, required: true, default: 0},
  scraped: { type: Boolean, default: false },
  scraped_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);