const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

/**
 * GET /api/transactions/summary
 * Purpose: Computes dashboard statistics from actual MongoDB transaction records.
 * 
 * Returns:
 * - totalIncome: Sum of all income transactions
 * - totalExpenses: Sum of all expense transactions
 * - currentBalance: totalIncome - totalExpenses
 * - currentMonthSpent: Total expenses incurred in the current month
 * - currentMonthBudget: Set budget for the current month (or 0 if unset)
 * - recentTransactions: Latest 5 transactions
 * - monthlyChartData: Aggregated income vs expenses per month for the chart
 */
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // 1. Calculate overall totals using MongoDB Aggregation
    const totalsAggregation = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    totalsAggregation.forEach(item => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpenses = item.total;
    });

    const currentBalance = totalIncome - totalExpenses;

    // 2. Calculate current month's expenses
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const monthExpenseAggregation = await Transaction.aggregate([
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

    const currentMonthSpent = monthExpenseAggregation.length > 0 ? monthExpenseAggregation[0].totalSpent : 0;

    // 3. Retrieve monthly budget from Budget collection
    const currentBudgetDoc = await Budget.findOne({ month: currentMonth, year: currentYear });
    const currentMonthBudget = currentBudgetDoc ? currentBudgetDoc.amount : 0;

    // 4. Retrieve recent 5 transactions
    const recentTransactions = await Transaction.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    // 5. Aggregate past 6 months income vs expense for the chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyBreakdown = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Build ordered list of the last 6 months for the chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyChartData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const label = `${monthNames[m - 1]} ${y.toString().slice(-2)}`;

      const incMatch = monthlyBreakdown.find(b => b._id.year === y && b._id.month === m && b._id.type === 'income');
      const expMatch = monthlyBreakdown.find(b => b._id.year === y && b._id.month === m && b._id.type === 'expense');

      monthlyChartData.push({
        month: label,
        income: incMatch ? incMatch.total : 0,
        expense: expMatch ? expMatch.total : 0
      });
    }

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        currentBalance,
        currentMonthSpent,
        currentMonthBudget,
        recentTransactions,
        monthlyChartData
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving summary statistics' });
  }
});

/**
 * GET /api/transactions
 * Retrieve all transactions with optional search, category, type filtering, and limit.
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, type, limit } = req.query;
    const filter = {};

    if (search && search.trim() !== '') {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    let query = Transaction.find(filter).sort({ date: -1, createdAt: -1 });

    if (limit && !isNaN(parseInt(limit))) {
      query = query.limit(parseInt(limit));
    }

    const transactions = await query;
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Error retrieving transactions' });
  }
});

/**
 * POST /api/transactions
 * Create a new transaction
 */
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Transaction title is required' });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: 'Please select a category' });
    }

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be income or expense' });
    }

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: parsedAmount,
      category,
      type,
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json({ success: true, data: transaction, message: 'Transaction recorded successfully' });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(400).json({ success: false, message: error.message || 'Validation error' });
  }
});

/**
 * PUT /api/transactions/:id
 * Update an existing transaction
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (title !== undefined) transaction.title = title.trim();
    if (amount !== undefined) {
      const parsed = Number(amount);
      if (isNaN(parsed) || parsed <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
      }
      transaction.amount = parsed;
    }
    if (category !== undefined) transaction.category = category;
    if (type !== undefined) transaction.type = type;
    if (date !== undefined) transaction.date = new Date(date);

    await transaction.save();

    res.json({ success: true, data: transaction, message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(400).json({ success: false, message: error.message || 'Error updating transaction' });
  }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ success: false, message: 'Error deleting transaction' });
  }
});

/**
 * POST /api/transactions/seed
 * Seed realistic student demo data to facilitate initial grading and exploration.
 */
router.post('/seed', async (req, res) => {
  try {
    const count = await Transaction.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.json({ success: true, message: 'Database already has records. Use ?force=true to reset.', count });
    }

    if (req.query.force) {
      await Transaction.deleteMany({});
    }

    const today = new Date();
    const sampleTransactions = [
      {
        title: 'College Internship Stipend',
        amount: 25000,
        category: 'Salary',
        type: 'income',
        date: new Date(today.getFullYear(), today.getMonth(), 1)
      },
      {
        title: 'Freelance Web Project',
        amount: 12000,
        category: 'Freelance',
        type: 'income',
        date: new Date(today.getFullYear(), today.getMonth(), 4)
      },
      {
        title: 'Engineering Textbooks & Notes',
        amount: 2400,
        category: 'Education',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 5)
      },
      {
        title: 'Campus Canteen Lunch',
        amount: 350,
        category: 'Food & Dining',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 7)
      },
      {
        title: 'Hostel Wi-Fi Broadband',
        amount: 799,
        category: 'Utilities',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 10)
      },
      {
        title: 'Metro & Bus Transit Pass',
        amount: 1200,
        category: 'Transportation',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 12)
      },
      {
        title: 'Supermarket Grocery Shopping',
        amount: 3150,
        category: 'Groceries',
        type: 'expense',
        date: new Date(today.getFullYear(), today.getMonth(), 13)
      }
    ];

    await Transaction.insertMany(sampleTransactions);

    // Also set a default budget for the current month if none exists (in INR)
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const existingBudget = await Budget.findOne({ month: currentMonth, year: currentYear });
    if (!existingBudget) {
      await Budget.create({ month: currentMonth, year: currentYear, amount: 18000 });
    }

    res.json({ success: true, message: 'Sample student transactions seeded successfully', count: sampleTransactions.length });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    res.status(500).json({ success: false, message: 'Error seeding demo data' });
  }
});

module.exports = router;
