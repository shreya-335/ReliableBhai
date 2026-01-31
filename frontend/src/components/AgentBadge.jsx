import React from 'react';

export const RiskBadge = ({ level }) => {
  const styles = {
    HIGH: "bg-rose-50 text-rose-600 border-rose-100",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
    LOW: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${styles[level]}`}>
      {level}
    </span>
  );
};

export const ConfidenceBar = ({ score }) => {
  const percentage = Math.round(score * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
        <div 
          className="h-full bg-zinc-800 transition-all duration-700" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-[10px] font-bold text-zinc-800">{percentage}%</span>
    </div>
  );
};