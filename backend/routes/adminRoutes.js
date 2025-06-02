const express = require('express');
const router = express.Router();
const path = require('path')
const { single } = require('../middleware/upload');
const verifyAdmin = require('../middleware/verifyAdmin');

const {
    checkAdmin
} = require('../controllers/orderController');

const orderRoutes = require('./admin/orderRoutes');
const projectRoutes = require('./admin/projectRoutes');
const productRoutes = require('./admin/productRoutes');
const categoryRoutes = require('./admin/categoryRoutes');
const subcategoryRoutes = require('./admin/subCategoryRoutes');
const subsubcategoryRoutes = require('./admin/subsubCategoryRoutes');
const uploadRoutes = require('./admin/uploadFile');

// Check admin password
router.post('/admin-access', checkAdmin);

//router.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// From this point on, protect all routes
router.use(verifyAdmin);

// Upload category image
router.post('/upload-image', single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    res.status(201).json({
      fileInfo: {
        fileId: req.file.id,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.use('/upload-file', uploadRoutes)

// Apply admin protection middleware to all subroutes
router.use('/orders', orderRoutes);
router.use('/projects', projectRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/subsubcategories', subsubcategoryRoutes);

module.exports = router;