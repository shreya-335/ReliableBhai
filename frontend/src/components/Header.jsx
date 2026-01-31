import React from 'react';
import { Activity, AlertCircle, CheckCircle, Zap } from 'lucide-react';

const Header = ({ health }) => {
  return (
    <div className="mb-8 space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest">Migration Health</span>
            <Activity size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-amber-600">{health.migration_health}</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest">Agent Impact</span>
            <Zap size={16} />
          </div>
          <div className="flex gap-4 items-baseline">
            <span className="text-2xl font-semibold">{health.resolved_count}</span>
            <span className="text-xs text-zinc-400 tracking-tight">Resolved</span>
            <span className="text-2xl font-semibold ml-auto">{health.escalated_count}</span>
            <span className="text-xs text-zinc-400 tracking-tight">Escalated</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest">Resolution Rate</span>
            <CheckCircle size={16} />
          </div>
          <div className="text-2xl font-semibold text-zinc-800">{health.auto_resolve_rate}</div>
        </div>
      </div>

      {/* Cluster Alert Banner */}
      <div className="flex items-center gap-3 p-4 bg-zinc-900 text-white rounded-lg animate-pulse">
        <AlertCircle size={20} className="text-amber-400" />
        <div className="flex-1 text-sm font-medium">
          Warning: Detected {health.active_clusters.length} similar ticket patterns related to '{health.active_clusters[0]}'
        </div>
        <button className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded transition">
          View Cluster
        </button>
      </div>
    </div>
  );
};

export default Header;