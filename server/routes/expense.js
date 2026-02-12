const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   GET /api/expenses
// @desc    Get all expenses for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Server error fetching expenses' });
  }
});

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    // Validation
    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const validCategories = ['food', 'transport', 'bills', 'fun', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const expense = new Expense({
      userId: req.userId,
      amount,
      category: category.toLowerCase(),
      description: description || '',
      date: date || Date.now()
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Server error creating expense' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.userId });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Server error deleting expense' });
  }
});

module.exports = router;
