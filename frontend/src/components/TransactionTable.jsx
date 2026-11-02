import React from 'react';
import {
  formatCurrency,
  formatDate,
  CATEGORY_COLORS,
} from '../utils/formatters';
import {
  ArrowDownRight,
  ArrowUpRight,
  Edit2,
  Trash2,
  Receipt,
  FileText,
} from 'lucide-react';

const TransactionTable = ({
  transactions = [],
  currency = '₹',
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-navy-900 border-t-transparent mb-2" />
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
          <Receipt className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Transactions Found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          No records match your selected filters or you have not recorded any transactions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Transaction</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const catColor = CATEGORY_COLORS[tx.category] || '#64748b';

              return (
                <tr
                  key={tx._id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Title & Notes */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {tx.title}
                        </p>
                        {tx.notes && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs flex items-center gap-1">
                            <FileText className="w-3 h-3 shrink-0" />
                            {tx.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: catColor }}
                      />
                      {tx.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(tx._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
