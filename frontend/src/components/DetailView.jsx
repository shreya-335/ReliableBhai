// src/components/DetailView.jsx
import React, { useState } from 'react';
import { ArrowLeft, Terminal, Cpu, Mail, ShieldAlert, Check, Fingerprint, Loader2, CheckCircle } from 'lucide-react';
import { ConfidenceBar, RiskBadge } from './AgentBadge';
import ReasoningStep from './ReasoningStep';

const DetailView = ({ data, onBack, loading }) => {
  const [resolutionText, setResolutionText] = useState('');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest">Fetching Trace Data...</p>
      </div>
    );
  }

  // Exact mapping based on the JSON response provided:
  const trigger = data?.trigger || {};
  const evidence = data?.input_evidence || {};
  const analysis = data?.agent_analysis || {};
  const actionPlan = data?.action_plan || {};
  const signals = evidence.summary || {};

  const handleResolve = () => {
    console.log(`Issue ${trigger.trigger_id} resolved with: ${resolutionText}`);
    alert(`Issue ${trigger.trigger_id} marked as resolved locally.`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest transition">
          <ArrowLeft size={14} /> Back to Overview
        </button>
        <div className="flex items-center gap-2 text-zinc-400">
          <Fingerprint size={12} />
          <span className="text-[9px] font-mono uppercase">Run: {trigger.trigger_id}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Input Evidence */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white border border-black/5 rounded-[24px] p-5 shadow-sm">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4">Input Signals</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Trigger Type</label>
                <p className="text-xs font-black text-zinc-900 italic uppercase">
                  {trigger.trigger_type?.replace(/_/g, ' ') || "N/A"}
                </p>
              </div>
              <div className="pt-3 border-t border-zinc-50">
                <label className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Impact</label>
                <p className="text-[10px] font-bold text-zinc-600">
                  {signals.event_count || 0} Events / {signals.affected_merchants_count || 0} Merchants
                </p>
                <p className="text-[9px] font-mono text-rose-500 mt-1 uppercase font-bold">
                  Trend: {signals.trend || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#09090b] rounded-[24px] p-5 shadow-xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
              <Terminal size={12} /> Correlated Events
            </div>
            <div className="space-y-3 font-mono text-[10px] text-zinc-300">
              {evidence.correlated_events?.length > 0 ? (
                evidence.correlated_events.map((event, i) => (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                    <p className="text-zinc-500 text-[8px]">{new Date(event.timestamp).toLocaleTimeString()}</p>
                    <p className="text-emerald-400 font-bold">{event.merchant_id}</p>
                    <p className="text-zinc-400 italic">
                      {typeof event.context === 'object' ? event.context.error_code : event.context}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 italic">No events found</p>
              )}
            </div>
          </div>
        </div>

        {/* Center: Reasoning Chain */}
        <div className="col-span-5">
          <div className="bg-white border border-black/5 rounded-[32px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-xl text-white">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest">Reasoning Chain</h3>
                </div>
              </div>
              <ConfidenceBar score={analysis.confidence || 0} />
            </div>

            <div className="space-y-1">
              {analysis.reasoning_trace?.length > 0 ? (
                analysis.reasoning_trace.map((step, i) => (
                  <ReasoningStep 
                    key={i} 
                    step={step} 
                    index={i} 
                    isLast={i === analysis.reasoning_trace.length - 1} 
                  />
                ))
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Trace not yet generated</p>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Root Cause Analysis</p>
              <p className="text-xs font-bold text-zinc-900 leading-relaxed mt-1">
                {analysis.root_cause || "Pending automated identification..."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Action Deck */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white border-2 border-zinc-900 rounded-[32px] p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
               <Mail size={16} className="text-zinc-900" />
               <h3 className="text-xs font-black uppercase tracking-widest">{actionPlan.action_type?.replace(/_/g, ' ') || "Action Plan"}</h3>
            </div>
            
            {actionPlan.content ? (
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-4">
                <p className="text-[9px] font-bold text-zinc-400 uppercase mb-2">Generated Draft</p>
                <p className="text-[10px] font-bold text-zinc-900 mb-1">{actionPlan.content.subject}</p>
                <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                  "{actionPlan.content.body}"
                </p>
              </div>
            ) : (
              <div className="bg-zinc-50 border border-dashed border-zinc-100 rounded-xl p-6 mb-4 text-center">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Awaiting Decision</p>
              </div>
            )}

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert size={12} className="text-amber-600" />
                <span className="text-[9px] font-black text-amber-800 uppercase">Decision Status</span>
              </div>
              <p className="text-[9px] text-amber-700 font-medium font-mono uppercase">
                {trigger.status?.replace(/_/g, ' ') || "N/A"}
              </p>
              <p className="text-[9px] text-amber-900 font-bold mt-1">
                {analysis.decision_label || "No Label"} (Risk: {actionPlan.risk_level || "Unknown"})
              </p>
            </div>

            {/* Developer Resolution Note */}
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Developer Resolution Note</label>
              <textarea 
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="What fixed the issue?"
                className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[10px] font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all resize-none h-20"
              />
              <button 
                onClick={handleResolve}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-transform active:scale-95 shadow-md shadow-emerald-100"
              >
                <CheckCircle size={14} /> Mark Resolved
              </button>
            </div>

            <div className="pt-4">
              <button className="w-full bg-zinc-900 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-transform active:scale-95">
                <Check size={14} strokeWidth={3} /> {analysis.decision_label || "Approve"} Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;