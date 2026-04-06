import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CreditCard, AlertTriangle, Activity, ShieldCheck, TrendingUp, Zap, Clock, RotateCcw } from 'lucide-react';

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

  const fetchData = async () => {
    try {
      const [txRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/transactions'),
        axios.get('http://localhost:5000/api/stats')
      ]);
      setTxs(txRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) { console.error("Shield Engine Offline", err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = async (formData) => {
    await axios.post('http://localhost:5000/api/transactions', { userId: 'arjun_surat', ...formData });
    fetchData(); 
  };

  const handleReset = async () => {
    if (window.confirm("RESET SHIELD ENGINE? This clears all historical data for the demo.")) {
      try {
        await axios.delete('http://localhost:5000/api/transactions/clear');
        setTxs([]);
        setStats({ totalSpent: 0, breachCount: 0, categoryData: [], projectedSpend: 0, safeDailyLimit: 0, isAtRisk: false });
        fetchData();
      } catch (err) { console.error("Reset Failed", err); }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-emerald-400 font-black text-2xl animate-pulse tracking-tighter uppercase">Initializing Shield...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 max-w-7xl mx-auto font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2">
            SpendShield <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full font-bold uppercase tracking-widest">Live</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Predictive Financial Guardrails</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={handleReset} className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-[10px] text-rose-500 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest shadow-sm">
            <RotateCcw size={14} /> Reset Engine
          </button>
          <div className="bg-slate-900 text-emerald-400 px-5 py-2 rounded-2xl flex items-center gap-2 font-black text-xs shadow-xl">
            <ShieldCheck size={18} /> SYSTEM ACTIVE
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Spent (This Month)" value={`₹${stats.totalSpent?.toLocaleString()}`} icon={CreditCard} />
        <StatCard title="Budget Used" value={`${((stats.totalSpent / 50000) * 100).toFixed(1)}%`} icon={Zap} colorClass={stats.totalSpent > 42500 ? "text-rose-600" : "text-blue-600"} />
        <StatCard title="Forecasted Total" value={`₹${stats.projectedSpend?.toFixed(0)}`} icon={TrendingUp} colorClass={stats.isAtRisk ? "text-rose-600" : "text-emerald-500"} />
        <StatCard title="Safe Daily Limit" value={`₹${stats.safeDailyLimit?.toFixed(0)}`} icon={AlertTriangle} colorClass="text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Simplified */}
        <div className="lg:col-span-4 space-y-8">
          <TransactionForm onAdd={handleAdd} />
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest text-center">Expense Intelligence</h4>
             <SpendingChart data={stats.categoryData} />
          </div>
        </div>

        {/* MAIN FEED: Clean Statement View */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Ledger</h2>
            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 animate-pulse bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">
              Auto-Sync On
            </div>
          </div>
          <HistoryTable transactions={txs} />
        </div>
      </div>
    </div>
  );
};

export default App;