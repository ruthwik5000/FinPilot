const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Investment = require('../models/Investment');
const Loan = require('../models/Loan');

// @route   POST /api/ai
// @desc    Get AI response based on user's financial data
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch user's financial data for context
    const expenses = await Expense.find({ userId: req.userId });
    const investments = await Investment.find({ userId: req.userId });
    const loans = await Loan.find({ userId: req.userId });

    // Calculate summary
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);

    // Prepare context for AI
    const financialContext = `
User's Financial Summary:
- Total Expenses: $${totalExpenses.toFixed(2)}
- Total Investments: $${totalInvested.toFixed(2)}
- Total Loans: $${totalLoans.toFixed(2)}
- Number of Expenses: ${expenses.length}
- Number of Investments: ${investments.length}
- Number of Loans: ${loans.length}

User Question: ${message}
`;

    // Call AI proxy
    if (!process.env.AI_PROXY_URL) {
      // If no AI proxy configured, return a helpful mock response
      return res.json({
        response: `I understand you're asking about: "${message}". Based on your financial data, you have $${totalExpenses.toFixed(2)} in expenses, $${totalInvested.toFixed(2)} in investments, and $${totalLoans.toFixed(2)} in loans. To get personalized AI advice, please configure the AI_PROXY_URL in your environment variables.`
      });
    }

    // Make request to AI proxy (OpenAI-compatible format)
    const aiResponse = await axios.post(
      process.env.AI_PROXY_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful financial advisor. ${financialContext}. Provide concise, actionable advice in 2-3 sentences.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_API_KEY}`
        },
        timeout: 30000
      }
    );

    // Extract response from OpenAI-compatible format
    const aiMessage = aiResponse.data.choices?.[0]?.message?.content || 
                      aiResponse.data.response || 
                      'No response from AI';

    res.json({ response: aiMessage });

  } catch (error) {
    console.error('AI chat error:', error.message);
    
    // Fallback response if AI fails
    res.json({
      response: "I'm having trouble connecting to the AI service right now. However, I can see your financial data. Would you like me to provide some general financial tips instead?"
    });
  }
});

module.exports = router;
