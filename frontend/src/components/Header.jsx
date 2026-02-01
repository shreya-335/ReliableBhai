// src/components/Header.jsx
import React from 'react';
import { Activity, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const Header = ({ health, onAgentImpactClick }) => {
  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card" style={{ backgroundColor: '#FDF2B3' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/60">Migration Health</span>
            <Activity size={18} className="text-amber-900/40" />
          </div>
          <div className="text-3xl font-bold text-amber-900 mb-1 tracking-tighter capitalize">{health.migration_health}</div>
        </div>

        {/* Clickable Agent Impact Tile */}
        <div 
          className="metric-card cursor-pointer hover:brightness-95 transition-all" 
          style={{ backgroundColor: '#FCE7F3' }}
          onClick={onAgentImpactClick}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-900/60">Agent Impact</span>
            <Zap size={18} className="text-rose-900/40" />
          </div>
          <div className="flex gap-4 items-baseline mb-3">
            <span className="text-3xl font-bold text-rose-900 tracking-tighter">{health.resolved_count} <span className="text-[10px] uppercase font-black opacity-40">Resolved</span></span>
            <span className="text-3xl font-bold text-rose-900 tracking-tighter">{health.escalated_count} <span className="text-[10px] uppercase font-black opacity-40">Escalated</span></span>
          </div>
          <div className="h-1.5 w-full bg-rose-900/10 rounded-full overflow-hidden">
             <div className="h-full bg-rose-400 w-3/4"></div>
          </div>
        </div>

        <div className="metric-card" style={{ backgroundColor: '#DBEAFE' }}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-900/60">Resolution Rate</span>
            <CheckCircle size={18} className="text-blue-900/40" />
          </div>
          <div className="text-4xl font-bold text-blue-900 tracking-tighter mb-2">{health.auto_resolve_rate}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;