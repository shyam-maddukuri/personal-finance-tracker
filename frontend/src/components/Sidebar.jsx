import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  X,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'budgets', label: 'Monthly Budgets', icon: Target },
  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
];

const Sidebar = ({ activeTab, onSelectTab, isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-full lg:h-[calc(100vh-4rem)] w-64 bg-navy-900 text-slate-200 border-r border-navy-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between p-4 border-b border-navy-800 lg:hidden">
            <span className="font-bold text-white text-base">Navigation</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Feature highlight card */}
        <div className="p-4 m-3 bg-navy-950/80 rounded-2xl border border-navy-800/80">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-white">Full Stack MERN</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Persistent storage powered by MongoDB Atlas, Node.js & Express REST APIs with JWT protection.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
