const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Subsubcategory = require('../models/Subsubcategory');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category_id', 'category_name')
      .populate('subcategory_id', 'subcategory_name')
      .populate('subsubcategory_id', 'subsubcategory_name');
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
    const product = await Product.findById(req.params.id)
      .populate('category_id', 'category_name')
      .populate('subcategory_id', 'subcategory_name')
      .populate('subsubcategory_id', 'subsubcategory_name');
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
    // Validate category exists
    const category = await Category.findById(req.body.category_id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Validate subcategory exists if provided
    if (req.body.subcategory_id) {
      const subcategory = await Subcategory.findById(req.body.subcategory_id);
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
    }

    // Validate subsubcategory exists if provided
    if (req.body.subsubcategory_id) {
      const subsubcategory = await Subsubcategory.findById(req.body.subsubcategory_id);
      if (!subsubcategory) {
        return res.status(404).json({ message: 'Subsubcategory not found' });
      }
    }

    const product = new Product({
      name: req.body.name,
      product_name: req.body.product_name || req.body.name,
      primary_url: req.body.primary_url,
      source_url: req.body.source_url,
      category_id: req.body.category_id,
      category_name: category.category_name,
      subcategory_id: req.body.subcategory_id,
      subcategory_name: req.body.subcategory_name,
      subsubcategory_id: req.body.subsubcategory_id,
      description: req.body.description,
      specifications: req.body.specifications,
      price: req.body.price,
      main_image_url: req.body.main_image_url,
      product_image_url: req.body.product_image_url,
      external_links: req.body.external_links,
      product_files: req.body.product_files
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('category_id', 'category_name')
      .populate('subcategory_id', 'subcategory_name')
      .populate('subsubcategory_id', 'subsubcategory_name');
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};