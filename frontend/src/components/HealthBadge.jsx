import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Database, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

const HealthBadge = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health');
      setHealth(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Cannot reach backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = health?.database?.connected;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-sm ${
          error
            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            : isConnected
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
        }`}
        title="Click to view Backend & Database Status"
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              error ? 'bg-red-400' : isConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              error ? 'bg-red-500' : isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </span>
        <Database className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {error
            ? 'Backend Offline'
            : isConnected
            ? 'MongoDB Atlas: Connected'
            : 'MongoDB: Not Connected'}
        </span>
        <span className="sm:hidden">
          {error ? 'Offline' : isConnected ? 'Connected' : 'No DB'}
        </span>
      </button>

      {/* Health Details Dropdown Modal */}
      {showDetails && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-xs text-slate-700 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-navy-700" />
              System Connection Status
            </h4>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100"
              title="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">API Server:</span>
              <span className="font-medium flex items-center gap-1">
                {error ? (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-red-500" /> Offline (Port 5000)
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Running (Port 5000)
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database (MongoDB Atlas):</span>
              <span className="font-medium flex items-center gap-1">
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Connected
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Disconnected
                  </>
                )}
              </span>
            </div>

            {health?.database?.host && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Atlas Cluster:</span>
                <span className="font-mono text-[11px] truncate max-w-[140px] text-slate-800">
                  {health.database.host}
                </span>
              </div>
            )}

            {health?.uptimeSeconds !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Server Uptime:</span>
                <span className="font-mono text-slate-800">{health.uptimeSeconds}s</span>
              </div>
            )}

            {!isConnected && !error && (
              <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                💡 <strong>MongoDB Atlas setup required:</strong> Add your Atlas connection string to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">backend/.env</code> as <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">MONGODB_URI</code> to enable persistent data storage.
              </div>
            )}

            {error && (
              <div className="mt-3 p-2.5 bg-red-50 rounded-lg border border-red-200 text-red-900 text-[11px] leading-relaxed">
                🚨 <strong>Backend server not reached:</strong> Open a terminal in <code className="bg-red-100 px-1 py-0.5 rounded font-mono">backend/</code> and run <code className="bg-red-100 px-1 py-0.5 rounded font-mono">npm run dev</code>.
              </div>
            )}
          </div>

          <button
            onClick={() => setShowDetails(false)}
            className="w-full mt-3 py-1.5 text-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthBadge;
