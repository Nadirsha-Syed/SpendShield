import React from 'react';

/**
 * StatCard Component
 * @param {string} title - The label of the card (e.g., "Total Spent")
 * @param {string|number} value - The main data to display
 * @param {React.ElementType} icon - The Lucide icon component
 * @param {string} colorClass - Tailwind text color class (e.g., "text-rose-600")
 * @param {React.ReactNode} children - Optional: Progress bars or extra text
 */
const StatCard = ({ title, value, icon: Icon, colorClass, children }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className={`text-3xl font-black ${colorClass || 'text-slate-900'}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl ${colorClass ? 'bg-slate-50' : 'bg-slate-50'}`}>
          <Icon className={colorClass || "text-slate-300"} size={28} />
        </div>
      </div>
      
      {/* This area renders the progress bar or subtitles if passed */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default StatCard;