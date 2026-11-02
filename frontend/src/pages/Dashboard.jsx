import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import StatCard from '../components/StatCard';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  PlusCircle,
  Receipt,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Dashboard = ({ user, currency = '₹', onNavigateToTransactions }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions/summary/stats');
      if (res.data?.success) {
        setStats(res.data.data);
        setError(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to connect to backend server. Make sure MongoDB Atlas is configured in backend/.env'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const summary = stats?.summary || {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    savingsRate: 0,
    currentMonth: { income: 0, expense: 0, savings: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-navy-900">{user?.name}</span>. Here is your financial overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setSelectedTx(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Backend / MongoDB Connectivity Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-rose-900">Database Connection Required</h4>
            <p className="mt-0.5 leading-relaxed text-rose-800">{error}</p>
            <p className="mt-1 text-slate-600">
              Check that your <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">MONGODB_URI</code> is properly configured in <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">backend/.env</code> and that your Atlas network access allows your IP.
            </p>
          </div>
        </div>
      )}

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Balance */}
        <StatCard
          title="Net Balance"
          amount={summary.netBalance}
          currency={currency}
          icon={Wallet}
          variant="blue"
          badgeText={summary.netBalance >= 0 ? 'Surplus' : 'Deficit'}
          badgeTrend={summary.netBalance >= 0 ? 'up' : 'down'}
          sublabel="All-time Net Worth"
        />

        {/* Total Income */}
        <StatCard
          title="Total Income"
          amount={summary.totalIncome}
          currency={currency}
          icon={ArrowUpRight}
          variant="emerald"
          badgeText={`This Month: ${formatCurrency(summary.currentMonth.income, currency)}`}
          badgeTrend="up"
          sublabel="All Earnings Recorded"
        />

        {/* Total Expenses */}
        <StatCard
          title="Total Expenses"
          amount={summary.totalExpenses}
          currency={currency}
          icon={ArrowDownRight}
          variant="rose"
          badgeText={`This Month: ${formatCurrency(summary.currentMonth.expense, currency)}`}
          badgeTrend="down"
          sublabel="All Outflows"
        />

        {/* Savings Rate */}
        <StatCard
          title="Savings Rate"
          amount={summary.savingsRate}
          currency={currency}
          icon={PiggyBank}
          variant="indigo"
          isPercentage={true}
          badgeText={summary.savingsRate >= 20 ? 'Target Met (≥20%)' : 'Below 20% Target'}
          badgeTrend={summary.savingsRate >= 20 ? 'up' : 'down'}
          sublabel="Calculated Savings"
        />
      </div>

      {/* Charts Section: Monthly Income vs Expenses & Category Breakdown */}
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

      {/* Recent Transactions List with View All */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Receipt className="w-4 h-4 text-sky-600" />
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500">
              Latest 5 activities recorded in your account
            </p>
          </div>
          {onNavigateToTransactions && (
            <button
              onClick={onNavigateToTransactions}
              className="text-xs font-semibold text-navy-900 hover:text-sky-600 hover:underline"
            >
              View All History →
            </button>
          )}
        </div>

        <TransactionTable
          transactions={stats?.recentTransactions || []}
          currency={currency}
          loading={loading}
          onEdit={(tx) => {
            setSelectedTx(tx);
            setModalOpen(true);
          }}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchDashboardData}
        transaction={selectedTx}
        currency={currency}
      />
    </div>
  );
};

export default Dashboard;
