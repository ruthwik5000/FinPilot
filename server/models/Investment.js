const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  asset: {
    type: String,
    required: [true, 'Asset symbol is required'],
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Investment type is required'],
    enum: ['stock', 'crypto'],
    lowercase: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be positive']
  },
  investedAmount: {
    type: Number,
    required: [true, 'Invested amount is required'],
    min: [0, 'Invested amount must be positive']
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Investment', investmentSchema);
