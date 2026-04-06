import React from 'react';

const HistoryTable = ({ transactions }) => {
  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Merchant</th>
            <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest text-right">Value</th>
            <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.map((t) => (
            <tr key={t._id} className="hover:bg-slate-50/30 transition-all group">
              <td className="p-6">
                <div className="font-bold text-slate-800">{t.merchant}</div>
                <div className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tighter">{t.category}</div>
              </td>
              <td className="p-6 text-right font-black text-slate-900">₹{t.amount.toLocaleString()}</td>
              <td className="p-6 text-right">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
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
  );
};

export default HistoryTable;