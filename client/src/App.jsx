import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'; 
import { CreditCard, AlertTriangle, ShieldCheck, TrendingUp, Zap, RotateCcw, Activity } from 'lucide-react';

import StatCard from './components/StatCard';
import TransactionForm from './components/TransactionForm';
import SpendingChart from './components/SpendingChart';
import HistoryTable from './components/HistoryTable';

const App = () => {
  const [txs, setTxs] = useState([]);
  const [stats, setStats] = useState({ 
    totalSpent: 0, breachCount: 0, categoryData: [], projectedSpend: 0, safeDailyLimit: 0, isAtRisk: false 
  });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // 1. TRACKER: Prevents the same alert from popping up multiple times
  const processedTxIds = useRef(new Set());

  // 2. REUSABLE AI POPUP ENGINE
  const triggerAIPopup = (data) => {
    const { status, reason, category, merchant, amount } = data;
    if (status === 'Safe') return; // Only popup for warnings/breaches in background

    toast(
      (t) => (
        <span className="flex flex-col">
          <b className="text-[10px] uppercase tracking-tighter opacity-60">{category} | AI Inference</b>
          <span className="text-xs font-black">{reason}</span>
          <span className="text-[9px] opacity-70 mt-1">Ref: {merchant} (₹{amount})</span>
        </span>
      ),
      {
        icon: status === 'Breach' ? '🚫' : '⚠️',
        duration: 5000,
        position: 'top-right',
        style: { 
          borderRadius: '18px', 
          background: status === 'Breach' ? '#fef2f2' : '#fffbeb',
          color: status === 'Breach' ? '#991b1b' : '#92400e',
          border: `1px solid ${status === 'Breach' ? '#fecaca' : '#fef3c7'}`,
          zIndex: 9999
        }
      }
    );
  };

  const fetchData = useCallback(async (showSilence = false) => {
    if (!showSilence) setIsSyncing(true);
    try {
      const [txRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/transactions'),
        axios.get('http://localhost:5000/api/stats')
      ]);

      const latestTxs = txRes.data;

      // 3. BACKGROUND MONITOR: Detect Simulator Warnings
      if (latestTxs.length > 0) {
        const newest = latestTxs[0];
        if (!processedTxIds.current.has(newest._id)) {
          triggerAIPopup(newest);
          processedTxIds.current.add(newest._id);
        }
      }

      setTxs(latestTxs);
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Shield Engine Offline", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 5000); 
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAdd = async (formData) => {
    const loadingToast = toast.loading("Analyzing...");
    try {
      const res = await axios.post('http://localhost:5000/api/transactions', { 
        userId: 'arjun_surat', ...formData 
      });
      toast.dismiss(loadingToast);
      processedTxIds.current.add(res.data._id); // Mark as seen
      triggerAIPopup(res.data);
      fetchData(); 
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Engine Fault");
    }
  };

  const handleReset = async () => {
    if (window.confirm("RESET ENGINE?")) {
      await axios.delete('http://localhost:5000/api/transactions/clear');
      processedTxIds.current.clear();
      fetchData();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-emerald-400 font-black">
      <Activity className="animate-spin mb-4" size={48} />
      <h2 className="text-2xl uppercase">Initializing Shield...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 max-w-7xl mx-auto font-sans text-slate-900">
      <Toaster position="top-right" containerStyle={{ top: 40, right: 40, zIndex: 9999 }} />
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2">SpendShield</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Predictive Financial Guardrails</p>
            {isSyncing && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-[10px] text-rose-500 uppercase">
            <RotateCcw size={14} /> Reset Engine
          </button>
          <div className="bg-slate-900 text-emerald-400 px-5 py-2 rounded-2xl flex items-center gap-2 font-black text-xs shadow-xl">
            <ShieldCheck size={18} /> SYSTEM ACTIVE
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Spent (Monthly)" value={`₹${stats.totalSpent?.toLocaleString()}`} icon={CreditCard} />
        <StatCard title="Budget Intensity" value={`${((stats.totalSpent / 50000) * 100).toFixed(1)}%`} icon={Zap} colorClass={stats.totalSpent > 42500 ? "text-rose-600" : "text-blue-600"} />
        <StatCard title="ML Forecast" value={`₹${stats.projectedSpend?.toFixed(0)}`} icon={TrendingUp} colorClass={stats.isAtRisk ? "text-rose-600 animate-pulse" : "text-emerald-500"} />
        <StatCard title="Safe Daily Limit" value={`₹${stats.safeDailyLimit?.toFixed(0)}`} icon={AlertTriangle} colorClass={stats.isAtRisk ? "text-rose-600" : "text-indigo-600"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <TransactionForm onAdd={handleAdd} />
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm" style={{ minHeight: '350px' }}>
             <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest text-center">Inference Distribution</h4>
             <SpendingChart data={stats.categoryData} />
          </div>
        </div>
        <div className="lg:col-span-8">
          <HistoryTable transactions={txs} />
        </div>
      </div>
    </div>
  );
};

export default App;