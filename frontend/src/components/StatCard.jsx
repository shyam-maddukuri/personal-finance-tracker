import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const colorVariants = {
  blue: {
    bg: 'bg-navy-900',
    border: 'border-navy-800',
    iconBg: 'bg-sky-500/10 text-sky-400',
    text: 'text-white',
    subtext: 'text-slate-400',
  },
  emerald: {
    bg: 'bg-white',
    border: 'border-slate-200/80',
    iconBg: 'bg-emerald-50 text-emerald-600',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
  },
  rose: {
    bg: 'bg-white',
    border: 'border-slate-200/80',
    iconBg: 'bg-rose-50 text-rose-600',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
  },
  indigo: {
    bg: 'bg-white',
    border: 'border-slate-200/80',
    iconBg: 'bg-indigo-50 text-indigo-600',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
  },
};

const StatCard = ({
  title,
  amount,
  currency = '₹',
  icon: Icon,
  variant = 'emerald',
  badgeText,
  badgeTrend,
  sublabel,
  isPercentage = false,
}) => {
  const styles = colorVariants[variant] || colorVariants.emerald;

  return (
    <div
      className={`relative p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${styles.bg} ${styles.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${styles.subtext}`}>
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className={`text-2xl font-bold tracking-tight ${styles.text}`}>
              {isPercentage ? `${amount}%` : formatCurrency(amount, currency)}
            </h3>
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${styles.iconBg} shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {badgeText && (
          <span
            className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] ${
              badgeTrend === 'up'
                ? 'bg-emerald-100 text-emerald-800'
                : badgeTrend === 'down'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {badgeTrend === 'up' && <TrendingUp className="w-3 h-3" />}
            {badgeTrend === 'down' && <TrendingDown className="w-3 h-3" />}
            {badgeText}
          </span>
        )}

        {sublabel && (
          <span className={`text-[11px] truncate ${styles.subtext}`}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
