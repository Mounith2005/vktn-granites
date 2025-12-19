const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  itemNameTamil: {
    type: String,
    trim: true
  },
  length: {
    type: String,
    required: true
  },
  width: {
    type: String,
    required: true
  },
  lengthUnit: {
    type: String,
    enum: ['ft', 'm', 'cm', 'in'],
    default: 'in'
  },
  widthUnit: {
    type: String,
    enum: ['ft', 'm', 'cm', 'in'],
    default: 'in'
  },
  runningFeet: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  templeName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalRunningFeet: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
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

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

orderSchema.statics.generateOrderNumber = async function() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }
  });
  
  const orderNum = (count + 1).toString().padStart(4, '0');
  return `ORD${year}${month}${orderNum}`;
};

module.exports = mongoose.model('Order', orderSchema);
