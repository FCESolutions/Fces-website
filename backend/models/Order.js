const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  productName: { // Storing denormalized data for historical reference
    type: String,
    required: true
  },
  productImage: String // Optional: Store image URL for reference
}, { _id: false });

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  /*address: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }*/}, { _id: false });

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
      message: 'Order must have at least one item'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', null],
    default: null
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