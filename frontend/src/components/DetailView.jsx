import React from 'react';
import { ArrowLeft, Terminal, Cpu, Mail, ShieldAlert, Check, X, Edit3, Fingerprint } from 'lucide-react';
import { ConfidenceBar, RiskBadge } from './AgentBadge';
import ReasoningStep from './ReasoningStep';

const DetailView = ({ data, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest transition">
          <ArrowLeft size={14} /> Back to Overview
        </button>
        <div className="flex items-center gap-2 text-zinc-400">
          <Fingerprint size={12} />
          <span className="text-[9px] font-mono uppercase">Session Trace: {data.ticket_id}-AUTH-99</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Merchant Context */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white border border-black/5 rounded-[24px] p-5 shadow-sm">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4">Merchant Snapshot</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Organization</label>
                <p className="text-xs font-black text-zinc-900 italic uppercase">{data.merchant_context.name}</p>
                <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 text-white rounded mt-1.5 inline-block uppercase font-bold">
                  {data.merchant_context.tier}
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-50">
                <label className="text-[9px] text-zinc-400 uppercase font-bold block mb-1">Milestone</label>
                <p className="text-[10px] font-bold text-zinc-600 italic">
                  {data.merchant_context.migration_status}
                </p>
              </div>
            </div>
          </div>

          {/* Live Telemetry */}
          <div className="bg-[#09090b] rounded-[24px] p-5 shadow-xl border border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
              <Terminal size={12} /> Live Telemetry
            </div>
            <div className="space-y-3 font-mono text-[10px]">
              {data.input_signals.system_logs.map((log, i) => (
                <div key={i} className="leading-tight">
                  <span className="text-zinc-600 block text-[8px] mb-0.5">{log.timestamp}</span>
                  <span className="text-rose-500 font-bold mr-2">[{log.level}]</span> 
                  <span className="text-zinc-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Agent Reasoning */}
        <div className="col-span-5">
          <div className="bg-white border border-black/5 rounded-[32px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-xl text-white">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest">Reasoning Chain</h3>
                  <p className="text-[9px] text-zinc-400 font-medium italic">Trace: 0xf92a...c321</p>
                </div>
              </div>
              <ConfidenceBar score={data.agent_reasoning.confidence_score} />
            </div>

            <div className="space-y-1">
              {data.agent_reasoning.trace.map((step, i) => (
                <ReasoningStep 
                  key={i} 
                  step={step} 
                  index={i} 
                  isLast={i === data.agent_reasoning.trace.length - 1} 
                />
              ))}
            </div>

            <div className="mt-4 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex gap-3 items-center">
              <div className="w-1.5 h-8 bg-zinc-900 rounded-full" />
              <div>
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Diagnosis</p>
                <p className="text-xs font-bold text-zinc-900">{data.agent_reasoning.root_cause}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Deck */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white border-2 border-zinc-900 rounded-[32px] p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
               <Mail size={16} className="text-zinc-900" />
               <h3 className="text-xs font-black uppercase tracking-widest">Proposed Action</h3>
            </div>
            
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-4">
              <p className="text-[9px] font-bold text-zinc-400 uppercase mb-2">Message Draft</p>
              <p className="text-[10px] font-bold text-zinc-900 mb-1">{data.action_plan.content.subject}</p>
              <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                "{data.action_plan.content.body}"
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert size={12} className="text-amber-600" />
                <span className="text-[9px] font-black text-amber-800 uppercase">Guardrail: {data.action_plan.risk_level}</span>
              </div>
              <p className="text-[9px] text-amber-700 font-medium">{data.action_plan.risk_reason}</p>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-zinc-900 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95">
                <Check size={14} strokeWidth={3} /> Approve & Execute
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 border border-zinc-200 py-2.5 rounded-xl text-[9px] font-black uppercase hover:bg-zinc-50 transition">
                  <Edit3 size={12} /> Edit
                </button>
                <button className="flex items-center justify-center gap-2 border border-zinc-200 py-2.5 rounded-xl text-[9px] font-black uppercase text-zinc-400 hover:text-rose-500 transition">
                  <X size={12} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;