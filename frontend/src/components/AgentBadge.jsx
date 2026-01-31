import React from 'react';

export const RiskBadge = ({ level }) => {
  const styles = {
    HIGH: "bg-red-50 text-red-700 border-red-100",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
    LOW: "bg-slate-50 text-slate-700 border-slate-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${styles[level]}`}>
      {level}
    </span>
  );
};

export const ConfidenceBar = ({ score }) => {
  const percentage = score * 100;
  const barColor = percentage > 85 ? 'bg-zinc-800' : 'bg-zinc-400';
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-[11px] font-medium text-zinc-500">{percentage}%</span>
    </div>
  );
};