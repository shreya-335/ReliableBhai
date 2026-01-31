import React from 'react';
import { ArrowLeft, Terminal, Cpu, Mail, ShieldAlert, Check, X, Edit3, Fingerprint } from 'lucide-react';
import { ConfidenceBar, RiskBadge } from './AgentBadge';
import ReasoningStep from './ReasoningStep'; // Import the new component

const DetailView = ({ data, onBack }) => {
  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-ink text-xs font-bold uppercase tracking-widest transition">
          <ArrowLeft size={14} /> Back to Overview
        </button>
        <div className="flex items-center gap-2 text-zinc-400">
          <Fingerprint size={14} />
          <span className="text-[10px] font-mono uppercase tracking-tighter">Session Trace: {data.ticket_id}-AUTH-99</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left: Input Signals */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Merchant Snapshot</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Organization</label>
                <p className="text-sm font-bold text-zinc-900">{data.merchant_context.name}</p>
                <span className="text-[10px] px-1.5 py-0.5 bg-zinc-900 text-white rounded mt-1 inline-block uppercase font-bold">
                  {data.merchant_context.tier}
                </span>
              </div>
              <div className="pt-4 border-t border-zinc-50">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Migration Milestone</label>
                <p className="text-xs font-medium text-zinc-600 mt-1 italic">
                  {data.merchant_context.migration_status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-xl p-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-2 opacity-10 uppercase text-[40px] font-black pointer-events-none text-white">LOG</div>
            <div className="flex items-center gap-2 mb-4 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              <Terminal size={14} /> Live Telemetry
            </div>
            <div className="space-y-4 font-mono text-[11px]">
              {data.input_signals.system_logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-zinc-600 block mb-1">TIMESTAMP: {log.timestamp}</span>
                  <span className="text-red-500 font-bold">[{log.level}]</span> 
                  <span className="text-zinc-300 ml-2">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Agent Reasoning */}
        <div className="col-span-5">
          <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-white">
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Reasoning Chain</h3>
                  <p className="text-[10px] text-zinc-400 font-medium italic">Trace ID: 0xf92a...c321</p>
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

            <div className="mt-4 p-5 bg-zinc-50 border border-zinc-100 rounded-xl flex gap-4 items-center">
              <div className="w-2 h-10 bg-zinc-900 rounded-full" />
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Final Diagnosis</p>
                <p className="text-sm font-bold text-zinc-900">{data.agent_reasoning.root_cause}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Deck */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white border-2 border-zinc-900 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
               <Mail size={18} className="text-zinc-900" />
               <h3 className="text-sm font-black uppercase tracking-widest">Proposed Action</h3>
            </div>
            
            <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-5 mb-6">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Message Draft</p>
              <p className="text-xs font-bold text-zinc-900 mb-2">Subject: {data.action_plan.content.subject}</p>
              <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed italic">
                "{data.action_plan.content.body}"
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-8">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={14} className="text-amber-600" />
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Risk Guardrail: {data.action_plan.risk_level}</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-normal font-medium">{data.action_plan.risk_reason}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <button className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]">
                <Check size={16} strokeWidth={3} /> Approve & Execute
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 border border-zinc-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition">
                  <Edit3 size={14} /> Edit
                </button>
                <button className="flex items-center justify-center gap-2 border border-zinc-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 hover:border-red-100 transition">
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-zinc-400 font-medium px-8">
            This action is protected by the Agent’s ethical limits. Financial transactions require manual override.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DetailView;