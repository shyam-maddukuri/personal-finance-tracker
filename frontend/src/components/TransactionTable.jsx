import React from 'react';

/**
 * TransactionTable Component
 * 
 * Displays transactions in a clean, accessible tabular layout.
 * 
 * Props:
 * - transactions: Array of transaction objects from MongoDB
 * - emptyMessage: Message to display if there are no records
 */
export default function TransactionTable({ transactions = [], emptyMessage = 'No transactions recorded yet.' }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Helper to format date cleanly
  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Helper to format currency in Indian Rupees (INR / ₹)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="table-wrapper">
      <table className="clean-table" aria-label="Transactions List">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Category</th>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col" style={{ textAlign: 'right' }}>Amount</th>
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
                <td style={{ color: 'var(--text-muted)' }}>{formatDate(tx.date)}</td>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
