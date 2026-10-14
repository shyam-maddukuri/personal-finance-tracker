import React from 'react';

/**
 * SummaryCard Component
 * 
 * Reusable metric card displaying financial summary totals.
 * 
 * Props:
 * - title: Label of the metric
 * - amount: Numeric value to format
 * - subtitle: Explanatory note or period
 * - icon: Lucide icon component
 * - variant: 'blue' | 'green' | 'red' | 'purple'
 */
export default function SummaryCard({ title, amount, subtitle, icon: Icon, variant = 'blue' }) {
  // Format numeric currency value cleanly in Indian Rupees (INR / ₹)
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount || 0);

  const iconClass = `card-icon-${variant}`;

  return (
    <div className="summary-card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        {Icon && (
          <div className={`card-icon-wrapper ${iconClass}`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="card-amount">{formattedAmount}</div>
      <div className="card-subtitle">{subtitle}</div>
    </div>
  );
}
