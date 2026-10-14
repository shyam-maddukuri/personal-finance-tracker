const mongoose = require('mongoose');

/**
 * Transaction Schema
 * 
 * Defines the structure of each financial record stored in MongoDB.
 * 
 * Fields:
 * - title: Descriptive name of the transaction (e.g. "Monthly Salary", "Grocery Shopping")
 * - amount: Numeric value (must be greater than 0)
 * - category: Standard classification for reports and budgeting
 * - type: Either 'income' (money received) or 'expense' (money spent)
 * - date: The date when the transaction occurred
 */
const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the transaction'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please enter a valid amount'],
      min: [0.01, 'Amount must be at least 0.01']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Salary',
          'Freelance',
          'Food & Dining',
          'Groceries',
          'Utilities',
          'Transportation',
          'Entertainment',
          'Healthcare',
          'Education',
          'Shopping',
          'Other'
        ],
        message: '{VALUE} is not a supported category'
      }
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense'
      }
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Index to improve search and sorting speed by date
transactionSchema.index({ date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
