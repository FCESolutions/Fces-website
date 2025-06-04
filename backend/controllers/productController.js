const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Subsubcategory = require('../models/Subsubcategory');
const crypto = require('crypto');
const mongoose = require('mongoose');
const GridFSController = require('./gridfsController');
const gridFS = new GridFSController();
const path = require('path');
const fs = require('fs');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by cat id or sub id or subsub id
exports.getProductsByLevel = async (req, res) => {
  try {
    const { categoryId, subcategoryId, subsubcategoryId } = req.params;
    let query = {};

    if (subsubcategoryId && subsubcategoryId !== 'null') {
      query.subsubcategory_id = subsubcategoryId;
    } else if (subcategoryId && subcategoryId !== 'null') {  // ✅ fixed here
      query = {
        subcategory_id: subcategoryId,
        $or: [
          { subsubcategory_id: null },
          { subsubcategory_id: { $exists: false } }
        ]
      };
    } else {
      // If no subcategory or subsubcategory selected, return nothing
      return res.status(200).json([]);
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category_id: req.params.categoryId })
      .populate('subcategory_id', 'subcategory_name')
      .populate('subsubcategory_id', 'subsubcategory_name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get products by subcategory
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const products = await Product.find({ subcategory_id: req.params.subcategoryId })
      .populate('category_id', 'category_name')
      .populate('subsubcategory_id', 'subsubcategory_name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get products by subsubcategory
exports.getProductsBySubsubcategory = async (req, res) => {
  try {
    const products = await Product.find({ subsubcategory_id: req.params.subsubcategoryId })
      .populate('category_id', 'category_name')
      .populate('subcategory_id', 'subcategory_name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      category_id,
      subcategory_id,
      subsubcategory_id,
      product_name,
      description,
      specifications,
      marque,
      product_image_url,
      product_image_file,
      external_links,
      product_files,
      stock,
    } = req.body;

    // Validate and fetch category
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Initialize subcategory and subsubcategory as null
    let subcategory = null;
    let subsubcategory = null;

    // Validate and fetch subcategory if provided
    if (subcategory_id) {
      subcategory = await Subcategory.findById(subcategory_id);
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
    }

    // Validate and fetch subsubcategory if provided
    if (subsubcategory_id) {
      subsubcategory = await Subsubcategory.findById(subsubcategory_id);
      if (!subsubcategory) {
        return res.status(404).json({ message: 'Subsubcategory not found' });
      }
    }

        // Handle file upload if present
    if (req.file) {
      product_image_file = {
        fileId: req.file.id,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
      // Clear URL if file is uploaded
      product_image_url = '';
    }

    // Create product
    const product = new Product({
      product_name: product_name,
      category_id,
      category_name: category.category_name,
      subcategory_id: subcategory_id || null,
      subcategory_name: subcategory ? subcategory.subcategory_name : null,
      subsubcategory_id: subsubcategory_id || null,
      subsubcategory_name: subsubcategory ? subsubcategory.subsubcategory_name : null,
      description,
      specifications,
      marque,
      product_image_url,
      product_image_file,
      external_links,
      product_files,
      stock,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);

  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

    // Handle file upload if present
    if (req.file) {
      // Delete previous file if it exists
      if (existingProduct.product_image_file?.fileId) {
        await gridFS.deleteFile(existingProduct.product_image_file.fileId);
      }

      updateData.product_image_file = {
        fileId: req.file.id,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
      // Clear URL if file is uploaded
      updateData.product_image_url = '';
    }

    // If switching from uploaded file to a URL, delete the previous uploaded file
    if (
      updateData.product_image_url &&
      !req.file &&
      existingProduct.product_image_file?.fileId
    ) {
      try {
        await gridFS.deleteFile(existingProduct.product_image_file.fileId);
        updateData.product_image_file = null;
      } catch (err) {
        console.error('Failed to delete previous uploaded file:', err.message);
      }
    }

    // Validate the specifications structure if present
    if (updateData.specifications) {
      if (typeof updateData.specifications !== 'object' || Array.isArray(updateData.specifications)) {
        return res.status(400).json({ message: 'Invalid specifications format' });
      }

      // Optional: Validate each category's structure
      for (const [categoryName, specs] of Object.entries(updateData.specifications)) {
        if (typeof specs !== 'object' || specs === null) {
          return res.status(400).json({ 
            message: `Invalid specifications format for category ${categoryName}`
          });
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true // Ensures updated data follows schema validation
      }
    )
    .populate('category_id', 'category_name')
    .populate('subcategory_id', 'subcategory_name')
    .populate('subsubcategory_id', 'subsubcategory_name');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    // More specific error handling
    if (err.name === 'CastError') {
      console.error('Invalid product ID:', err.value);
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    if (err.name === 'ValidationError') {
      console.error('Validation error:', err.message);
      return res.status(400).json({ message: err.message });
    }
    console.error('Error updating product:', err);
    res.status(500).json({ 
      message: 'Error updating product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const urlsToCheck = [];

    // Gather file URLs from both product_files and external_links (if any)
    if (Array.isArray(product.product_files)) {
      product.product_files.forEach(f => {
        if (f.url) urlsToCheck.push(f.url);
      });
    }

    if (Array.isArray(product.external_links)) {
      product.external_links.forEach(l => {
        if (l.url && l.url.startsWith('/uploads/')) {
          urlsToCheck.push(l.url);
        }
      });
    }

    // Delete the product from the DB first
    await Product.findByIdAndDelete(req.params.id);

    // For each file URL, check if it's used elsewhere
    for (const url of urlsToCheck) {
      const filename = path.basename(url);
      const filePath = path.join(__dirname, '../uploads', filename);

      // Search for any other product using the same file
      const stillUsed = await Product.findOne({
        $or: [
          { 'product_files.url': url },
          { 'external_links.url': url }
        ]
      });

      if (!stillUsed && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted file: ${filename}`);
      } else {
        console.log(`📎 Skipped deleting ${filename}: still used or not found`);
      }
    }

    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    res.send(updated);
  } catch (error) {
    res.status(400).send({ error: 'Erreur de mise à jour du stock' });
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFile = await gridFS.uploadFile(req.file);

    res.status(200).json({
      message: 'File uploaded successfully',
      fileInfo: {
        fileId: uploadedFile.fileId,
        filename: uploadedFile.filename,
        mimetype: uploadedFile.contentType,
        size: uploadedFile.size
      }
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'File upload failed', error: err.message });
  }
};

exports.getProductImage = async (req, res) => {
  try {
    await gridFS.streamFile(req.params.id, res, {
      cacheControl: 'public, max-age=31536000'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};