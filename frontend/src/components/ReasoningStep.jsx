import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ReasoningStep = ({ step, index, isLast }) => {
  return (
    <div className="relative pl-7 group">
      {!isLast && (
        <div className="absolute left-[10px] top-5 w-[1px] h-full bg-zinc-100 group-hover:bg-zinc-200 transition-colors" />
      )}
      
      <div className="absolute left-0 top-0.5 text-zinc-900 bg-white">
        <CheckCircle2 size={20} strokeWidth={2} />
      </div>

      <div className="pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">
            Step 0{index + 1}
          </span>
        </div>
        <p className="text-[11px] text-zinc-600 leading-relaxed font-bold">
          {step}
        </p>
      </div>
    </div>
  );
};

export default ReasoningStep;