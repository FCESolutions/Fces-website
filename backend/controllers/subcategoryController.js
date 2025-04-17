const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category_id', 'category_name');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get subcategories by category ID
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ category_id: req.params.categoryId });
    res.json(subcategories);
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
    const category = await Category.findById(req.body.category_id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = new Subcategory({
      subcategory_name: req.body.subcategory_name,
      subcategory_url: req.body.subcategory_url,
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
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSubcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(updatedSubcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};