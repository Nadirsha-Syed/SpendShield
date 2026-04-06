import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, CreditCard, ShieldCheck, PlusCircle } from 'lucide-react';

const App = () => {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ merchant: '', amount: '' });
  const budgetLimit = 50000;

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTxs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/transactions', {
      userId: 'arjun_surat',
      merchant: form.merchant,
      amount: Number(form.amount)
    });
    setForm({ merchant: '', amount: '' });
    fetchData(); // Refresh list to see the new Guardrail status
  };

  const totalSpent = txs.reduce((acc, curr) => acc + curr.amount, 0);
  const breachCount = txs.filter(t => t.status === 'Breach').length;
  const budgetUsage = (totalSpent / budgetLimit) * 100;

  if (loading) return <div className="p-10 text-center font-bold">Connecting to Shield Engine...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">SpendShield</h1>
          <p className="text-slate-500 font-medium">Real-time Guardrails • Arjun's Textile Hub</p>
        </div>
        <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-200">
          <ShieldCheck size={20} /> SYSTEM LIVE
        </div>
      </header>

      {/* Quick Add Form - THE DEMO MOVER */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Simulate Transaction</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input 
            className="flex-1 bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Merchant (e.g. Zomato, Amazon)"
            value={form.merchant}
            onChange={e => setForm({...form, merchant: e.target.value})}
            required
          />
          <input 
            className="w-full md:w-48 bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            required
          />
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            <PlusCircle size={20}/> Pay Now
          </button>
        </form>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-slate-400 font-bold text-xs uppercase mb-1">Total Monthly Spend</div>
          <div className="text-3xl font-black text-slate-900">₹{totalSpent.toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-slate-400 font-bold text-xs uppercase mb-1 text-right">Budget Utilization</div>
          <div className="w-full bg-slate-100 h-4 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${budgetUsage > 85 ? 'bg-rose-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(budgetUsage, 100)}%` }}
            />
          </div>
          <div className="text-right text-sm mt-2 font-black text-slate-700">{budgetUsage.toFixed(1)}% used</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-slate-400 font-bold text-xs uppercase mb-1">Risk Alerts</div>
            <div className="text-3xl font-black text-rose-600">{breachCount}</div>
          </div>
          <AlertTriangle className={breachCount > 0 ? "text-rose-500 animate-pulse" : "text-slate-200"} size={40} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-slate-400 font-bold text-xs uppercase">Merchant</th>
              <th className="p-6 text-slate-400 font-bold text-xs uppercase text-center">Category</th>
              <th className="p-4 text-slate-400 font-bold text-xs uppercase text-right">Value</th>
              <th className="p-6 text-slate-400 font-bold text-xs uppercase text-right">Guardrail Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {txs.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50/50 transition-all">
                <td className="p-6">
                  <div className="font-bold text-slate-800">{t.merchant}</div>
                  <div className="text-[10px] text-slate-400 font-mono italic">{t._id.slice(-8)}</div>
                </td>
                <td className="p-6 text-center">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                    {t.category || 'Misc'}
                  </span>
                </td>
                <td className="p-4 text-right font-black text-slate-900">₹{t.amount.toLocaleString()}</td>
                <td className="p-6 text-right">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    t.status === 'Breach' ? 'bg-rose-100 text-rose-600' : 
                    t.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;