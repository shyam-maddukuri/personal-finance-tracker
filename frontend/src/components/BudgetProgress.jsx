import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

const BudgetProgress = ({ budget, currency = '₹', onDelete }) => {
  const { category, amount, spent, remaining, percentage, isExceeded, overAmount } = budget;

  // Determine progress bar color based on percentage used
  let barColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (isExceeded) {
    barColor = 'bg-rose-500';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (percentage >= 85) {
    barColor = 'bg-amber-500';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {category}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(spent, currency)}
            </span>
            <span className="text-xs text-slate-400">
              of {formatCurrency(amount, currency)} limit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeColor}`}
          >
            {isExceeded ? (
              <>
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Over by {formatCurrency(overAmount, currency)}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {percentage}% used
              </>
            )}
          </span>

          {onDelete && (
            <button
              onClick={() => onDelete(budget._id)}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors"
              title="Delete budget limit"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {/* Subtext info */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {isExceeded ? 'Exceeded Budget' : `${formatCurrency(remaining, currency)} remaining`}
        </span>
        <span className="font-medium text-slate-700">{percentage}%</span>
      </div>
    </div>
  );
};

export default BudgetProgress;
