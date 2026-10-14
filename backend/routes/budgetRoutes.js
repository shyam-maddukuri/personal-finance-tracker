const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

/**
 * GET /api/budget
 * Retrieves budget for a given month and year (defaults to current month)
 * and calculates the actual spending and remaining balance.
 */
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    // Find the budget record
    const budgetDoc = await Budget.findOne({ month, year });
    const budgetAmount = budgetDoc ? budgetDoc.amount : 0;

    // Calculate actual expenses incurred in this month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const expenseAggregation = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const spent = expenseAggregation.length > 0 ? expenseAggregation[0].totalSpent : 0;
    const remaining = budgetAmount - spent;
    const percentSpent = budgetAmount > 0 ? Math.min(Math.round((spent / budgetAmount) * 100), 100) : 0;

    res.json({
      success: true,
      data: {
        month,
        year,
        budget: budgetAmount,
        spent,
        remaining,
        percentSpent
      }
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ success: false, message: 'Error retrieving budget data' });
  }
});

/**
 * POST /api/budget
 * Set or update the budget for a specific month and year.
 */
router.post('/', async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ success: false, message: 'Valid month (1-12) is required' });
    }

    if (isNaN(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
      return res.status(400).json({ success: false, message: 'Valid 4-digit year is required' });
    }

    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ success: false, message: 'Budget amount must be a non-negative number' });
    }

    // Upsert (update if exists, insert if not)
    const budget = await Budget.findOneAndUpdate(
      { month: parsedMonth, year: parsedYear },
      { amount: parsedAmount },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Monthly budget updated successfully for ${parsedMonth}/${parsedYear}`,
      data: budget
    });
  } catch (error) {
    console.error('Error setting budget:', error);
    res.status(400).json({ success: false, message: error.message || 'Error setting budget' });
  }
});

module.exports = router;
