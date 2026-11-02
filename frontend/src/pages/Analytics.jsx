import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';

const Analytics = ({ currency = '₹' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions/summary/stats');
      if (res.data?.success) {
        setStats(res.data.data);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const summary = stats?.summary || {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    savingsRate: 0,
  };

  const categories = stats?.categoryBreakdown || [];

  // Calculate health score (0 - 100) based on savings rate & balance
  let healthScore = 50;
  if (summary.totalIncome > 0) {
    if (summary.savingsRate >= 30) healthScore = 95;
    else if (summary.savingsRate >= 20) healthScore = 85;
    else if (summary.savingsRate >= 10) healthScore = 70;
    else if (summary.savingsRate >= 0) healthScore = 55;
    else healthScore = 30;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Visual Analytics & Financial Health
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Deep dive into spending patterns, historical trends, and savings metrics.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-navy-900 hover:bg-slate-50 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Financial Health Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-navy-950 text-white rounded-2xl p-6 border border-navy-800 flex items-center justify-between md:col-span-1 shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Financial Health Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-white">{healthScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              {healthScore >= 80
                ? '🌟 Excellent financial discipline and savings habit'
                : healthScore >= 60
                ? '👍 Stable balance with room for higher savings'
                : '⚠️ High expenditure relative to income'}
            </p>
          </div>

          <div className="p-3.5 bg-sky-500/20 rounded-2xl text-sky-400">
            <Award className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between md:col-span-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Savings Efficiency
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {summary.savingsRate}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Portion of income saved after all expenses
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between md:col-span-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Net Capital Growth
            </span>
            <div
              className={`mt-2 text-2xl font-bold ${
                summary.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(summary.netBalance, currency)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cumulative lifetime balance retained
            </p>
          </div>
          <div className="p-3.5 bg-sky-50 rounded-2xl text-sky-600">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart
            data={stats?.monthlyTimeline || []}
            currency={currency}
          />
        </div>
        <div>
          <CategoryPieChart
            data={stats?.categoryBreakdown || []}
            currency={currency}
          />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-1">
          Detailed Category Distribution
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          All-time expense allocation by category
        </p>

        {categories.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No category transactions recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Transactions</th>
                  <th className="py-2.5 px-3 text-right">Total Spent</th>
                  <th className="py-2.5 px-3 text-right">% of Outflows</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat, idx) => {
                  const color = CATEGORY_COLORS[cat.name] || '#64748b';
                  return (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {cat.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{cat.count} records</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {formatCurrency(cat.value, currency)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                          {cat.percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
