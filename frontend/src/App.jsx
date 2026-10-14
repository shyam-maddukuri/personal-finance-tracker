import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import './App.css';

/**
 * Main Application Component
 * 
 * Manages the current active tab and provides the top-level academic layout.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard setActiveTab={setActiveTab} />
        )}

        {activeTab === 'transactions' && (
          <Transactions />
        )}

        {activeTab === 'budget' && (
          <div className="section-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Monthly Budget Planning</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
              Monthly budget setting and remaining spending progress bar will be activated in Stage 3.
            </p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setActiveTab('dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="section-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Category & Expense Reports</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
              Category breakdown pie charts and monthly financial reports will be activated in Stage 4.
            </p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setActiveTab('dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Academic Footer */}
      <footer className="footer">
        <p>Personal Finance Tracker &bull; MERN Stack Academic Project &bull; Built with React, Express, Node.js & MongoDB</p>
      </footer>
    </div>
  );
}
