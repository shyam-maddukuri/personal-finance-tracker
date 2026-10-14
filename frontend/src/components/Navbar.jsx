import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, Wallet } from 'lucide-react';

/**
 * Navbar Component
 * 
 * Provides top-level navigation between the application views.
 * 
 * Props:
 * - activeTab: string representing current page ('dashboard', 'transactions', 'budget', 'reports')
 * - setActiveTab: function to change the active view
 */
export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-section">
          <div className="brand-icon">
            <Wallet size={20} />
          </div>
          <div>
            <span className="brand-title">Personal Finance Tracker</span>
          </div>
          <span className="brand-badge">Academic Project</span>
        </div>

        <nav className="nav-links" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
