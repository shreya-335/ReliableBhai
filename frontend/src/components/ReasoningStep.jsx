import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const ReasoningStep = ({ step, index, isLast }) => {
  return (
    <div className="relative pl-8 group">
      {/* Vertical Line Connector */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 w-[2px] h-full bg-zinc-100 group-hover:bg-zinc-200 transition-colors" />
      )}
      
      {/* Indicator Dot */}
      <div className="absolute left-0 top-1 text-zinc-800 bg-white">
        <CheckCircle2 size={24} strokeWidth={1.5} />
      </div>

      <div className="pb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Step 0{index + 1}
          </span>
          <span className="h-[1px] w-4 bg-zinc-100"></span>
        </div>
        <p className="text-sm text-zinc-700 leading-relaxed font-medium">
          {step}
        </p>
      </div>
    </div>
  );
};

export default ReasoningStep;