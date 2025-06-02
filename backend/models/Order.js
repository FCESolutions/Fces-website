const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: { // Storing denormalized data for historical reference
    type: String,
    required: true
  },
  productImage: String, // Optional: Store image URL for reference
  productImageFile: {
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
    mimetype: String,
    size: Number
  }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'est invalide']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'La commande doit avoir au moins un article'
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['En attente', 'En cours de traitement', 'Livré', 'Annulé'],
    default: 'En attente'
  },
  orderNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(5, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Add text index for search
orderSchema.index({
  'orderNumber': 'text',
  'customer.name': 'text',
  'customer.email': 'text',
  'customer.phone': 'text',
  'items.productName': 'text'
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;