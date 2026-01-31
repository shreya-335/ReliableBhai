import React from 'react';
import { RiskBadge, ConfidenceBar } from './AgentBadge';
import { ExternalLink } from 'lucide-react';

const TicketTable = ({ tickets, onSelect }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
          Intelligent Queue
        </h3>
        <div className="flex gap-2">
          <select className="text-xs border-zinc-200 rounded p-1 outline-none">
            <option>All Risk Levels</option>
            <option>High Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-white text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
          <tr>
            <th className="px-6 py-4">Ticket & Merchant</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Agent Confidence</th>
            <th className="px-6 py-4">Risk</th>
            <th className="px-6 py-4">Proposed Action</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-50">
          {tickets.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect?.(t.id)}   // ✅ click handler added
              className="hover:bg-zinc-50/50 cursor-pointer transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-900 flex items-center gap-1">
                    {t.id}
                    <ExternalLink
                      size={12}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400"
                    />
                  </span>
                  <span className="text-xs text-zinc-500">{t.merchant}</span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-700">
                    {t.category}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {t.migration_stage}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <ConfidenceBar score={t.agent_analysis.confidence_score} />
              </td>

              <td className="px-6 py-4">
                <RiskBadge level={t.agent_analysis.risk_level} />
              </td>

              <td className="px-6 py-4">
                <span className="text-xs italic text-zinc-600 bg-zinc-100 px-2 py-1 rounded">
                  {t.agent_analysis.proposed_action_type.replace('_', ' ')}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                    t.status === 'awaiting_approval'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-zinc-500 bg-zinc-100'
                  }`}
                >
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
