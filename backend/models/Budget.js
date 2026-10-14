const mongoose = require('mongoose');

/**
 * Budget Schema
 * 
 * Stores the monthly spending budget set by the user.
 * 
 * Fields:
 * - month: 1 to 12 (January to December)
 * - year: 4-digit year (e.g., 2026)
 * - amount: Maximum budget target in currency units
 */
const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: [true, 'Month is required (1-12)'],
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 2000,
      max: 2100
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Ensure a single budget document per month and year
budgetSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
