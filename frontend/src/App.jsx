import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import TransactionModal from './components/TransactionModal';
import { Wallet } from 'lucide-react';

const MainLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'transactions' | 'budgets' | 'analytics'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalAddTxOpen, setGlobalAddTxOpen] = useState(false);

  // Key to trigger refresh when a new transaction is added via global modal
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 bg-navy-950 rounded-2xl flex items-center justify-center text-sky-400 shadow-xl mb-4 animate-bounce">
          <Wallet className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading Personal Finance Tracker...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const userCurrency = user?.currency || '₹';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenAddTransaction={() => setGlobalAddTxOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              key={refreshKey}
              user={user}
              currency={userCurrency}
              onNavigateToTransactions={() => setActiveTab('transactions')}
            />
          )}

          {activeTab === 'transactions' && (
            <Transactions
              key={refreshKey}
              currency={userCurrency}
            />
          )}

          {activeTab === 'budgets' && (
            <Budgets
              key={refreshKey}
              currency={userCurrency}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics
              key={refreshKey}
              currency={userCurrency}
            />
          )}
        </main>
      </div>

      {/* Global Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={globalAddTxOpen}
        onClose={() => setGlobalAddTxOpen(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
        currency={userCurrency}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
