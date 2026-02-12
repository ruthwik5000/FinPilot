const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Loan = require('../models/Loan');

// Helper function to calculate EMI
const calculateEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};

// @route   GET /api/loans
// @desc    Get all loans for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Server error fetching loans' });
  }
});

// @route   POST /api/loans
// @desc    Create a new loan
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { amount, interestRate, tenure } = req.body;

    // Validation
    if (!amount || !interestRate || !tenure) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (amount <= 0 || interestRate < 0 || tenure <= 0) {
      return res.status(400).json({ error: 'Invalid values provided' });
    }

    // Calculate EMI
    const emi = calculateEMI(amount, interestRate, tenure);

    const loan = new Loan({
      userId: req.userId,
      amount,
      interestRate,
      tenure,
      emi,
      paidMonths: 0
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Server error creating loan' });
  }
});

// @route   PATCH /api/loans/:id
// @desc    Update paid months for a loan
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  try {
    const { paidMonths } = req.body;

    if (paidMonths === undefined || paidMonths < 0) {
      return res.status(400).json({ error: 'Invalid paid months value' });
    }

    const loan = await Loan.findOne({ _id: req.params.id, userId: req.userId });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (paidMonths > loan.tenure) {
      return res.status(400).json({ error: 'Paid months cannot exceed tenure' });
    }

    loan.paidMonths = paidMonths;
    await loan.save();

    res.json(loan);
  } catch (error) {
    console.error('Update loan error:', error);
    res.status(500).json({ error: 'Server error updating loan' });
  }
});

// @route   DELETE /api/loans/:id
// @desc    Delete a loan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.userId });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await Loan.deleteOne({ _id: req.params.id });
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Server error deleting loan' });
  }
});

module.exports = router;
