const Subcategory = require('../models/Subcategory');
const SubSubcategory = require('../models/Subsubcategory');
const Category = require('../models/Category');
const Product = require('../models/Product');
const GridFSController = require('./gridfsController');
const gridfs = new GridFSController();

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get subcategories by category ID with product if there is any
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // 1. Get subcategories
    const subcategories = await Subcategory.find({ category_id: categoryId });

    // 2. Get products directly under category (no subcategory or subsubcategory)
    const productsAtCategoryLevel = await Product.find({
      category_id: req.params.categoryId,
      $and: [
        { $or: [{ subcategory_id: null }, { subcategory_id: { $exists: false } }] },
        { $or: [{ subsubcategory_id: null }, { subsubcategory_id: { $exists: false } }] }
      ]
    })

    res.json({
      subcategories,
      products: productsAtCategoryLevel
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate('category_id', 'category_name');
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    if (!req.body.subcategory_image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const category = await Category.findById(req.body.category_id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = new Subcategory({
      subcategory_name: req.body.subcategory_name,
      category_id: req.body.category_id,
      category_name: category.category_name,
      subcategory_image_url: req.body.subcategory_image_url
    });

    const newSubcategory = await subcategory.save();
    res.status(201).json(newSubcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { subcategory_name, ...otherFields } = req.body;

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { subcategory_name, ...otherFields },
      { new: true }
    );

    if (!updatedSubcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Update sub-subcategories
    await SubSubcategory.updateMany(
      { subcategory_id: req.params.id },
      { $set: { subcategory_name } }
    );

    // Update products
    await Product.updateMany(
      { subcategory_id: req.params.id },
      { $set: { subcategory_name } }
    );

    res.json(updatedSubcategory);
  } catch (err) {
    console.error('Subcategory update error:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  const session = await Subcategory.startSession();
  session.startTransaction();
  try {
    const subcategoryId = req.params.id;

    const subsubcategories = await SubSubcategory.find({ subcategory_id: subcategoryId }).session(session);
    const subsubcategoryIds = subsubcategories.map(subsub => subsub._id);

    await Product.deleteMany({
      $or: [
        { subcategory_id: subcategoryId },
        { subsubcategory_id: { $in: subsubcategoryIds } }
      ]
    }).session(session);

    await SubSubcategory.deleteMany({ _id: { $in: subsubcategoryIds } }).session(session);

    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId).session(session);
    if (!deletedSubcategory) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    await session.commitTransaction();
    res.json({ message: 'Subcategory and related data deleted successfully.' });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error deleting subcategory and related data:', err);
    res.status(500).json({ message: 'Error deleting subcategory and related data.', error: err.message });
  } finally {
    session.endSession();
  }
};
