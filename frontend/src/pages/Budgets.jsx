import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import BudgetProgress from '../components/BudgetProgress';
import BudgetModal from '../components/BudgetModal';
import {
  Target,
  PlusCircle,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatMonthYear } from '../utils/formatters';

const Budgets = ({ currency = '₹' }) => {
  const currentMonthStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr());
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/budgets?month=${selectedMonth}`);
      if (res.data?.success) {
        setBudgetData(res.data.data);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch budget information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget rule?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove budget');
      }
    }
  };

  const budgets = budgetData?.budgets || [];
  const totalBudget = budgetData?.totalBudget || 0;
  const totalSpent = budgetData?.totalSpent || 0;
  const overallRemaining = budgetData?.overallRemaining || 0;
  const overallPercentage = budgetData?.overallPercentage || 0;
  const isOverallExceeded = totalSpent > totalBudget && totalBudget > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Monthly Budget Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Set category limits and track actual spending against thresholds in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Overview Total Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overview for {formatMonthYear(selectedMonth)}
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalSpent, currency)}
              </h3>
              <span className="text-xs text-slate-500">
                spent of {formatCurrency(totalBudget, currency)} total allocated
              </span>
            </div>
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isOverallExceeded
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : overallPercentage >= 85
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isOverallExceeded ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Budget Exceeded
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {overallRemaining > 0
                    ? `${formatCurrency(overallRemaining, currency)} Remaining`
                    : 'On Track'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Overall Spending Consumption</span>
            <span className="font-bold text-slate-800">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isOverallExceeded
                  ? 'bg-rose-500'
                  : overallPercentage >= 85
                  ? 'bg-amber-500'
                  : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-600" />
            Category Budget Limits ({budgets.length})
          </h3>
          <span className="text-xs text-slate-500">
            {formatMonthYear(selectedMonth)}
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-navy-800 mb-2" />
            Loading budget records...
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-600 mb-3">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              No Budgets Set For {formatMonthYear(selectedMonth)}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Setting category budgets helps monitor overspending and maintain healthy savings habits.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-sky-400" /> Set First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => (
              <BudgetProgress
                key={b._id}
                budget={b}
                currency={currency}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Educational Tips Card */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-950 text-white rounded-2xl p-5 border border-navy-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">
              The 50 / 30 / 20 Personal Finance Rule
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Allocate <strong>50%</strong> of your income to essential Needs (Housing, Groceries, Utilities), <strong>30%</strong> to Wants (Entertainment, Shopping, Dining), and save or invest the remaining <strong>20%</strong> for long-term financial security.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchBudgets}
        month={selectedMonth}
        currency={currency}
      />
    </div>
  );
};

export default Budgets;
