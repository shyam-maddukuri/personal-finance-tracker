import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Education',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Salary',
  'Freelance',
  'Other'
];

/**
 * TransactionModal Component
 * 
 * Accessible popup modal for adding or editing a transaction.
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onSave: (transactionData) => Promise<void>
 * - initialData: existing transaction object if editing, or null if adding
 */
export default function TransactionModal({ isOpen, onClose, onSave, initialData = null }) {
  const isEditing = Boolean(initialData && initialData._id);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? initialData.amount.toString() : '');
      setType(initialData.type || 'expense');
      setCategory(initialData.category || 'Food & Dining');
      if (initialData.date) {
        setDate(new Date(initialData.date).toISOString().split('T')[0]);
      }
    } else {
      // Reset defaults for adding new transaction
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrorMessage('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Input Validation
    if (!title.trim()) {
      setErrorMessage('Please enter a title for the transaction.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!category) {
      setErrorMessage('Please select a category.');
      return;
    }

    if (!date) {
      setErrorMessage('Please select a valid date.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave({
        title: title.trim(),
        amount: numAmount,
        type,
        category,
        date: new Date(date).toISOString(),
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error saving transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="error-banner" style={{ margin: '1rem 1.25rem 0 1.25rem' }}>
            {errorMessage}
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type Selector (Income vs Expense) */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div className="type-toggle-container">
              <button
                type="button"
                className={`type-btn ${type === 'expense' ? 'type-btn-expense-active' : ''}`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'income' ? 'type-btn-income-active' : ''}`}
                onClick={() => {
                  setType('income');
                  if (category === 'Food & Dining' || category === 'Groceries') {
                    setCategory('Salary');
                  }
                }}
              >
                Income
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-title">
              Title / Description <span style={{ color: 'var(--color-expense)' }}>*</span>
            </label>
            <input
              id="tx-title"
              type="text"
              className="form-input"
              placeholder="e.g., Campus Canteen Lunch, Textbooks, Stipend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-amount">
              Amount (in ₹) <span style={{ color: 'var(--color-expense)' }}>*</span>
            </label>
            <input
              id="tx-amount"
              type="number"
              step="any"
              min="0.01"
              className="form-input"
              placeholder="e.g., 350"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-category">
              Category <span style={{ color: 'var(--color-expense)' }}>*</span>
            </label>
            <select
              id="tx-category"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-date">
              Date <span style={{ color: 'var(--color-expense)' }}>*</span>
            </label>
            <input
              id="tx-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Check size={16} />
              <span>{submitting ? 'Saving...' : isEditing ? 'Update Transaction' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
