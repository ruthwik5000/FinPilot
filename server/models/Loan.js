const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [0, 'Loan amount must be positive']
  },
  interestRate: {
    type: Number,
    required: [true, 'Interest rate is required'],
    min: [0, 'Interest rate must be positive']
  },
  tenure: {
    type: Number,
    required: [true, 'Tenure is required'],
    min: [1, 'Tenure must be at least 1 month']
  },
  emi: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  paidMonths: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);
