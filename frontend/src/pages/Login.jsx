import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogIn, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import HealthBadge from '../components/HealthBadge';

const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please verify your credentials or server connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for college academic project testing
  const handleQuickDemoFill = () => {
    setEmail('student@demo.edu');
    setPassword('demopass123');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      {/* Top Brand */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-navy-950 rounded-2xl flex items-center justify-center mx-auto text-sky-400 shadow-xl mb-3">
          <Wallet className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">
          Personal Finance Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          MERN Stack Academic Project • MongoDB Atlas Persistent Storage
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-navy-950 p-6 text-white border-b border-navy-900 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Account Sign In</h2>
            <p className="text-xs text-slate-400">Enter your credentials to continue</p>
          </div>
          <HealthBadge />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-sky-400" />
                <span>Sign In to Tracker</span>
              </>
            )}
          </button>

          {/* Academic Demo helper */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] text-sky-600 hover:text-sky-700 hover:underline"
            >
              Fill test demo credentials (student@demo.edu)
            </button>
          </div>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-600">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-navy-900 hover:text-sky-600 hover:underline"
          >
            Create free account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
