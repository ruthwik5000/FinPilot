const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');

// @route   GET /api/investments
// @desc    Get all investments for logged-in user with current prices
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Fetch current prices for each investment
    const investmentsWithPrices = await Promise.all(
      investments.map(async (investment) => {
        let currentPrice = 0;

        try {
          if (investment.type === 'crypto') {
            // Fetch crypto price from CoinGecko
            const response = await axios.get(
              `https://api.coingecko.com/api/v3/simple/price?ids=${investment.asset.toLowerCase()}&vs_currencies=usd`
            );
            currentPrice = response.data[investment.asset.toLowerCase()]?.usd || 0;
          } else if (investment.type === 'stock') {
            // Fetch stock price from AlphaVantage
            const response = await axios.get(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${investment.asset}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
            );
            currentPrice = parseFloat(response.data['Global Quote']?.['05. price']) || 0;
          }
        } catch (error) {
          console.error(`Error fetching price for ${investment.asset}:`, error.message);
          // Use a fallback price if API fails
          currentPrice = investment.investedAmount / investment.quantity;
        }

        const currentValue = currentPrice * investment.quantity;

        return {
          ...investment.toObject(),
          currentPrice,
          currentValue
        };
      })
    );

    res.json(investmentsWithPrices);
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ error: 'Server error fetching investments' });
  }
});

// @route   POST /api/investments
// @desc    Create a new investment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { asset, type, quantity, investedAmount } = req.body;

    // Validation
    if (!asset || !type || !quantity || !investedAmount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (quantity <= 0 || investedAmount <= 0) {
      return res.status(400).json({ error: 'Quantity and invested amount must be positive' });
    }

    const validTypes = ['stock', 'crypto'];
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({ error: 'Type must be either stock or crypto' });
    }

    const investment = new Investment({
      userId: req.userId,
      asset: asset.toUpperCase(),
      type: type.toLowerCase(),
      quantity,
      investedAmount
    });

    await investment.save();
    res.status(201).json(investment);
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Server error creating investment' });
  }
});

// @route   DELETE /api/investments/:id
// @desc    Delete an investment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.userId });

    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    await Investment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({ error: 'Server error deleting investment' });
  }
});

module.exports = router;
