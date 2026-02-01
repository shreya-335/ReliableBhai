// src/components/TicketTable.jsx
import React from 'react';
import { ConfidenceBar, RiskBadge } from './AgentBadge';

const TicketTable = ({ tickets, onSelect }) => {
  return (
    <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-lg font-bold uppercase tracking-tight">Active Triggers</h2>
      </div>

      <table className="w-full text-left">
        <thead className="text-[9px] font-black uppercase tracking-widest text-zinc-300 border-b border-zinc-50">
          <tr>
            <th className="px-4 py-4">Trigger ID</th>
            <th className="px-4 py-4">Type</th>
            <th className="px-4 py-4 text-center">Confidence</th>
            <th className="px-4 py-4 text-center">Risk</th>
            <th className="px-4 py-4 text-center">Decision</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {tickets.map((t) => {
            const runId = t.run_id || t.trigger_id;
            const analysis = t.analysis || {};
            const signals = analysis.input_signals || {};
            const gov = t.governance || {};

            return (
              <tr 
                key={runId} 
                onClick={() => onSelect(runId)}
                className="group hover:bg-zinc-50/80 cursor-pointer transition-colors"
              >
                <td className="px-4 py-6">
                  <p className="text-[10px] font-mono font-bold text-zinc-900">
                    {runId}
                  </p>
                </td>
                <td className="px-4 py-6">
                  <p className="text-[11px] font-bold text-zinc-800 uppercase tracking-tighter">
                    {(signals.trigger_type || t.trigger_type || "Unknown").replace(/_/g, ' ')}
                  </p>
                  <p className="text-[9px] text-zinc-400 italic">{signals.event_type || t.event_type}</p>
                </td>
                <td className="px-4 py-6 text-center">
                  <ConfidenceBar score={analysis.confidence_score || t.agent_confidence || 0} />
                </td>
                <td className="px-4 py-6 text-center">
                  <RiskBadge level={gov.risk_score > 70 ? "HIGH" : (gov.risk_score > 30 ? "MEDIUM" : "LOW")} />
                </td>
                <td className="px-4 py-6 text-center">
                   <span className="px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter bg-zinc-900 text-white">
                     {gov.decision_label || "Pending"}
                   </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;