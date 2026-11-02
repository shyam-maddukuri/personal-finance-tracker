const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets for a given month with actual spending comparison
// @route   GET /api/budgets?month=YYYY-MM
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Default to current month if not provided
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const targetMonth = req.query.month || currentMonthStr;

    // Parse month date bounds
    const [yearStr, monthStr] = targetMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // 1. Fetch user's budgets for this month
    const budgets = await Budget.find({
      user: userId,
      month: targetMonth,
    }).sort({ category: 1 });

    // 2. Fetch user's actual spending in this month grouped by category
    const actualSpending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    // Map spending to quick lookup
    const spendingMap = {};
    let totalSpentInMonth = 0;
    actualSpending.forEach((item) => {
      spendingMap[item._id] = item.totalSpent;
      totalSpentInMonth += item.totalSpent;
    });

    // 3. Combine budgets with actual spending
    let totalBudgetAmount = 0;
    const enrichedBudgets = budgets.map((b) => {
      const budgetAmount = b.amount;
      totalBudgetAmount += budgetAmount;
      const spent = spendingMap[b.category] || 0;
      const remaining = Math.max(0, budgetAmount - spent);
      const percentage = budgetAmount > 0 ? Math.min(100, Math.round((spent / budgetAmount) * 100)) : 0;
      const isExceeded = spent > budgetAmount;
      const overAmount = isExceeded ? Math.round((spent - budgetAmount) * 100) / 100 : 0;

      return {
        _id: b._id,
        category: b.category,
        month: b.month,
        amount: budgetAmount,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage,
        isExceeded,
        overAmount,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        month: targetMonth,
        totalBudget: Math.round(totalBudgetAmount * 100) / 100,
        totalSpent: Math.round(totalSpentInMonth * 100) / 100,
        overallRemaining: Math.max(0, Math.round((totalBudgetAmount - totalSpentInMonth) * 100) / 100),
        overallPercentage:
          totalBudgetAmount > 0
            ? Math.round((totalSpentInMonth / totalBudgetAmount) * 100)
            : 0,
        budgets: enrichedBudgets,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a budget for a category & month
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res, next) => {
  try {
    const { category, month, amount } = req.body;

    if (!category || !month || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, month (YYYY-MM), and amount',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget amount must be greater than 0',
      });
    }

    // Upsert budget: update if exists for this user/month/category, or create
    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        month,
        category,
      },
      {
        amount: Number(amount),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: budget,
      message: 'Budget saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Budget removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  setBudget,
  deleteBudget,
};
