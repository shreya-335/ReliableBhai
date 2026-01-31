import React from 'react';
import { MessageSquare, Cpu, Activity } from 'lucide-react';

const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <div className="w-64 border-r border-black/5 h-screen sticky top-0 p-6 space-y-8 bg-white">
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-zinc-900 p-1.5 rounded-lg text-white">
          <Activity size={16} />
        </div>
        <div className="font-black text-base tracking-tighter italic uppercase">Reliable_Bhai</div>
      </div>
      
      <nav className="space-y-2">
        <button 
          onClick={() => onNavigate('support')}
          className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
            activePage === 'support' 
              ? 'bg-zinc-900 text-white shadow-lg' 
              : 'text-zinc-400 hover:bg-zinc-50'
          }`}
        >
          <MessageSquare size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Support Platform</span>
        </button>

        <button 
          onClick={() => onNavigate('system')}
          className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
            activePage === 'system' 
              ? 'bg-zinc-900 text-white shadow-lg' 
              : 'text-zinc-400 hover:bg-zinc-50'
          }`}
        >
          <Cpu size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">System Events</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;