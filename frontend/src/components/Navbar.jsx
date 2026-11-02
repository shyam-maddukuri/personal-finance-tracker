import React from 'react';
import { useAuth } from '../context/AuthContext';
import HealthBadge from './HealthBadge';
import {
  Wallet,
  LogOut,
  User,
  PlusCircle,
  Menu,
} from 'lucide-react';

const Navbar = ({ onOpenAddTransaction, onToggleMobileMenu }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-navy-950 text-white shadow-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                  Finance<span className="text-sky-400">Tracker</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase hidden sm:block">
                  MERN Academic Demo
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions, Health Status, User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Action Button */}
            {onOpenAddTransaction && (
              <button
                onClick={onOpenAddTransaction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-sky-500/25 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Transaction</span>
              </button>
            )}

            {/* Backend & DB Health Indicator */}
            <HealthBadge />

            {/* User Profile / Logout */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-navy-800">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-sky-400 font-semibold text-xs shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-navy-850 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
