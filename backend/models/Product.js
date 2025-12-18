const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Temple Granite', 'Kitchen Countertop', 'Flooring', 'Wall Cladding', 'Monument', 'Custom'],
    default: 'Temple Granite'
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    default: 'India'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    default: 'per sq ft'
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800'
  },
  specifications: {
    thickness: String,
    finish: String,
    density: String,
    waterAbsorption: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
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

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
