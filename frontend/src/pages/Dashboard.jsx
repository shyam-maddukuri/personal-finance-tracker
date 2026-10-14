import React, { useState, useEffect } from 'react';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet, 
  PiggyBank, 
  RefreshCw, 
  Database,
  ArrowRight,
  Plus
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import TransactionTable from '../components/TransactionTable';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import TransactionModal from '../components/TransactionModal';
import { getDashboardSummary, seedDemoData, createTransaction } from '../services/api';

/**
 * Dashboard Page
 * 
 * Main landing page presenting an overview of the user's financial health.
 * 
 * Displays:
 * 1. 4 Summary Metric Cards: Total Income, Total Expenses, Current Balance, and Monthly Budget.
 * 2. Income vs. Expense monthly comparison chart (using Recharts).
 * 3. Recent 5 transactions table with formatted dates and status tags.
 * 4. Academic controls to seed sample data and refresh directly from MongoDB.
 */
export default function Dashboard({ setActiveTab }) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load summary statistics from the backend
  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardSummary();
      if (res.success) {
        setSummaryData(res.data);
      } else {
        setError(res.message || 'Failed to load dashboard summary');
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError('Could not connect to the backend server. Ensure Express is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  // Quick action for students and faculty reviewers to populate sample records
  const handleSeedData = async () => {
    try {
      setSeeding(true);
      await seedDemoData(true);
      await loadSummary();
    } catch (err) {
      setError('Error loading sample data: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleCreateTransaction = async (formData) => {
    await createTransaction(formData);
    await loadSummary();
  };

  const totalIncome = summaryData?.totalIncome || 0;
  const totalExpenses = summaryData?.totalExpenses || 0;
  const currentBalance = summaryData?.currentBalance || 0;
  const currentMonthBudget = summaryData?.currentMonthBudget || 0;
  const currentMonthSpent = summaryData?.currentMonthSpent || 0;
  const recentTransactions = summaryData?.recentTransactions || [];
  const monthlyChartData = summaryData?.monthlyChartData || [];

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const budgetSubtitle = currentMonthBudget > 0 
    ? `${formatCurrency(currentMonthSpent)} spent of ${formatCurrency(currentMonthBudget)}`
    : 'No budget set for this month';

  return (
    <div>
      {/* Page Title & Controls */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Dashboard</h1>
          <p className="page-subtitle">Academic Overview of Income, Expenses, and Monthly Budget</p>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            title="Record a new expense or income transaction"
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={loadSummary} 
            disabled={loading}
            title="Refresh statistics from MongoDB"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleSeedData} 
            disabled={seeding}
            title="Populate database with sample student transactions"
          >
            <Database size={14} />
            <span>{seeding ? 'Seeding...' : 'Load Sample Data'}</span>
          </button>
        </div>
      </div>

      {/* Backend / MongoDB Connectivity Status */}
      <div className="status-banner">
        <div className="status-info">
          <span className="status-dot"></span>
          <span><strong>MongoDB Connected:</strong> Live data calculated from database records</span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Backend: Express (Port 5000)
        </span>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="cards-grid">
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          subtitle="All-time earnings & stipend"
          icon={ArrowUpCircle}
          variant="green"
        />

        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          subtitle="All-time recorded spending"
          icon={ArrowDownCircle}
          variant="red"
        />

        <SummaryCard
          title="Current Balance"
          amount={currentBalance}
          subtitle="Net savings (Income - Expenses)"
          icon={Wallet}
          variant="blue"
        />

        <SummaryCard
          title="Monthly Budget"
          amount={currentMonthBudget}
          subtitle={budgetSubtitle}
          icon={PiggyBank}
          variant="purple"
        />
      </div>

      {/* Two Column Grid: Monthly Chart & Recent Transactions */}
      <div className="dashboard-grid">
        {/* Income vs Expenses Chart */}
        <section className="section-card">
          <div className="section-header">
            <h2 className="section-title">Income vs. Expenses (Past 6 Months)</h2>
          </div>
          <IncomeExpenseChart data={monthlyChartData} />
        </section>

        {/* Recent Transactions List */}
        <section className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Transactions</h2>
            <button 
              type="button" 
              className="section-action" 
              onClick={() => setActiveTab('transactions')}
            >
              View All <ArrowRight size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </button>
          </div>
          <TransactionTable 
            transactions={recentTransactions} 
            emptyMessage="No transactions yet. Click 'Load Sample Data' above or add a new transaction."
          />
        </section>
      </div>

      {/* Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTransaction}
      />
    </div>
  );
}
