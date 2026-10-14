import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ArrowUpDown,
  RefreshCw,
  AlertCircle 
} from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../services/api';

const CATEGORIES = [
  'All',
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
 * Transactions Page
 * 
 * Full CRUD and filtering interface for all personal finance records.
 */
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Fetch transactions from MongoDB
  const fetchList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTransactions({
        search: searchTerm,
        category: selectedCategory,
        type: selectedType
      });
      if (res.success) {
        setTransactions(res.data);
      } else {
        setError(res.message || 'Error fetching transactions');
      }
    } catch (err) {
      console.error('Error in fetchList:', err);
      setError('Could not connect to backend server on port 5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [searchTerm, selectedCategory, selectedType]);

  // Open Modal to Add
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveTransaction = async (formData) => {
    if (editingTransaction && editingTransaction._id) {
      await updateTransaction(editingTransaction._id, formData);
      setActionSuccessMsg('Transaction updated successfully!');
    } else {
      await createTransaction(formData);
      setActionSuccessMsg('Transaction added successfully!');
    }
    await fetchList();
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Handle Delete with student-friendly confirmation
  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    try {
      await deleteTransaction(id);
      setActionSuccessMsg(`Deleted "${title}" successfully.`);
      await fetchList();
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete transaction: ' + err.message);
    }
  };

  // Format currency in Indian Rupees (₹)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Add, edit, delete, and filter your financial records</p>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleOpenAddModal}
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="status-banner" style={{ borderLeftColor: '#10b981', color: '#065f46' }}>
          <strong>Success:</strong> {actionSuccessMsg}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="section-card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div className="filter-bar">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title (e.g. Lunch, Textbooks)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-cat" className="filter-label">Category:</label>
            <select
              id="filter-cat"
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-type" className="filter-label">Type:</label>
            <select
              id="filter-type"
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm || selectedCategory !== 'All' || selectedType !== 'all') && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedType('all');
              }}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            All Records {transactions.length > 0 && `(${transactions.length})`}
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Stored in MongoDB
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.5rem auto' }} />
            <p>Loading transactions from database...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>No transactions found.</p>
            <p style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              {searchTerm || selectedCategory !== 'All' || selectedType !== 'all'
                ? 'Try clearing your search or filter options.'
                : 'Get started by adding your first income or expense transaction.'}
            </p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleOpenAddModal}
            >
              <Plus size={16} />
              <span>Add First Transaction</span>
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="clean-table" aria-label="Transactions Master List">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Category</th>
                  <th scope="col">Date</th>
                  <th scope="col">Type</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
                  <th scope="col" style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx._id}>
                      <td>
                        <strong style={{ fontWeight: 500 }}>{tx.title}</strong>
                      </td>
                      <td>
                        <span className="badge badge-category">{tx.category}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {formatDate(tx.date)}
                      </td>
                      <td>
                        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={isIncome ? 'amount-income' : 'amount-expense'}>
                          {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            title="Edit Transaction"
                            onClick={() => handleOpenEditModal(tx)}
                            aria-label={`Edit ${tx.title}`}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn action-delete"
                            title="Delete Transaction"
                            onClick={() => handleDelete(tx._id, tx.title)}
                            aria-label={`Delete ${tx.title}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
      />
    </div>
  );
}
