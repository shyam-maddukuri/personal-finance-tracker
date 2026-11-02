export const formatCurrency = (amount, currency = '₹') => {
  const num = Number(amount) || 0;
  // Use Indian Numbering System (en-IN) when currency is ₹
  const locale = currency === '₹' ? 'en-IN' : 'en-US';
  return `${currency}${num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatInputDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  const d = new Date(dateString);
  return d.toISOString().split('T')[0];
};

export const formatMonthYear = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Gifts',
  'Other Income',
];

export const EXPENSE_CATEGORIES = [
  'Housing & Rent',
  'Groceries & Food',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Personal Care',
  'Other Expense',
];

export const CATEGORY_COLORS = {
  'Housing & Rent': '#1e3a8a', // Deep navy
  'Groceries & Food': '#0284c7', // Sky blue
  'Utilities': '#0d9488', // Teal
  'Transportation': '#f59e0b', // Amber
  'Entertainment': '#8b5cf6', // Violet
  'Healthcare': '#ef4444', // Red
  'Shopping': '#ec4899', // Pink
  'Education': '#10b981', // Emerald
  'Personal Care': '#6366f1', // Indigo
  'Other Expense': '#64748b', // Slate
  'Salary': '#10b981',
  'Freelance': '#06b6d4',
  'Investments': '#3b82f6',
  'Business': '#6366f1',
  'Gifts': '#a855f7',
  'Other Income': '#84cc16',
};
