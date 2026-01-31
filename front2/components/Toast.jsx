import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';

  return (
    <div className={`fixed bottom-10 right-10 flex items-center gap-4 px-6 py-4 rounded-[24px] shadow-2xl animate-in slide-in-from-right-10 duration-300 border ${
      isSuccess 
        ? 'bg-zinc-900 border-white/10 text-white' 
        : 'bg-rose-500 border-rose-400 text-white'
    }`}>
      <div className={isSuccess ? 'text-emerald-400' : 'text-white'}>
        {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
          {isSuccess ? 'System Signal' : 'Transmission Error'}
        </span>
        <p className="text-[11px] font-bold tracking-tight">{message}</p>
      </div>

      <button 
        onClick={onClose}
        className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;