import React from 'react';
import { ConfidenceBar, RiskBadge } from './AgentBadge';

const TicketTable = ({ tickets, onSelect }) => {
  return (
    <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-tight">Intelligent Queue</h2>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Automated sorting by agent confidence</p>
        </div>
        <select className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest outline-none">
          <option>All Risk Levels</option>
        </select>
      </div>

      <table className="w-full text-left">
        <thead className="text-[9px] font-black uppercase tracking-widest text-zinc-300 border-b border-zinc-50">
          <tr>
            <th className="px-4 py-4">Ticket & Merchant</th>
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4">Agent Confidence</th>
            <th className="px-4 py-4 text-center">Risk</th>
            <th className="px-4 py-4 text-center">Proposed Action</th>
            <th className="px-4 py-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {tickets.map((t) => (
            <tr 
              key={t.id} 
              onClick={() => onSelect?.(t.id)}
              className="group hover:bg-zinc-50/80 cursor-pointer transition-colors"
            >
              <td className="px-4 py-6">
                <p className="text-xs font-bold text-zinc-900 mb-0.5">{t.id}</p>
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{t.merchant}</p>
              </td>
              <td className="px-4 py-6">
                <p className="text-[11px] font-bold text-zinc-800">{t.category}</p>
                <p className="text-[9px] text-zinc-400 italic">{t.migration_stage}</p>
              </td>
              <td className="px-4 py-6">
                <ConfidenceBar score={t.agent_analysis.confidence_score} />
              </td>
              <td className="px-4 py-6 text-center">
                <RiskBadge level={t.agent_analysis.risk_level} />
              </td>
              <td className="px-4 py-6 text-center">
                <span className="text-[10px] font-mono text-zinc-500 italic">
                  {t.agent_analysis.proposed_action_type.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-6 text-center">
                 <span className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter ${
                   t.status === 'awaiting_approval' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-zinc-100 text-zinc-500'
                 }`}>
                   {t.status.replace('_', ' ')}
                 </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;