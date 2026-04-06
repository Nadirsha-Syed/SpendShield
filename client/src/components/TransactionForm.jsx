import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const TransactionForm = ({ onAdd }) => {
  const [form, setForm] = useState({ merchant: '', amount: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.merchant || !form.amount) return;
    onAdd(form);
    setForm({ merchant: '', amount: '' });
  };

  return (
    <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8">
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
        Quick Simulation
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap gap-3">
        {/* Merchant - Flexible width */}
        <div className="flex-[3] min-w-[140px]">
          <input 
            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-semibold" 
            placeholder="Merchant"
            value={form.merchant}
            onChange={e => setForm({...form, merchant: e.target.value})}
            required
          />
        </div>

        {/* Amount - Fixed smaller width to prevent compression */}
        <div className="flex-1 min-w-[80px] max-w-[120px]">
          <input 
            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-semibold" 
            placeholder="₹ Amount"
            type="number"
            value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            required
          />
        </div>

        {/* Pay Button - Fixed width so it never squashes */}
        <button className="flex-none bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 text-xs shadow-md active:scale-95">
          <PlusCircle size={14}/> 
          Pay
        </button>
      </form>
    </section>
  );
};

export default TransactionForm;