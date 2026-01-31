// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import TicketTable from './components/TicketTable';
import DetailView from './components/DetailView';
import SidebarCalendar from './components/SidebarCalendar';

import { dashboardData, ticketDetail } from './data/mockData';
import { Search, Bell, User, LayoutGrid, FileText, Activity } from 'lucide-react';

function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="min-h-screen bg-[#F9F6F1] font-sans text-[#18181b] antialiased">
      
      {/* Top Navigation */}
      <nav className="h-14 border-b border-black/5 bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg text-white">
              <Activity size={16} />
            </div>
            <div className="font-black text-base tracking-tighter italic uppercase">
              Reliable_Bhai
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span
              className={`cursor-pointer flex items-center gap-2 ${
                !selectedTicket ? 'text-zinc-900' : ''
              }`}
            >
              <LayoutGrid size={14} /> Command Center
            </span>
            <span className="cursor-pointer flex items-center gap-2 hover:text-zinc-900 transition-colors">
              <Activity size={14} /> Patterns
            </span>
            <span className="cursor-pointer flex items-center gap-2 hover:text-zinc-900 transition-colors">
              <FileText size={14} /> Logs
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-zinc-400">
          <Search size={18} className="cursor-pointer hover:text-zinc-900 transition" />
          <div className="relative cursor-pointer hover:text-zinc-900 transition">
            <Bell size={18} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase leading-none">
                Bhaiiiii
              </p>
              <p className="text-[8px] font-bold text-zinc-400 uppercase">
                Lead Engineer
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#E5D5C0] border border-black/5 flex items-center justify-center text-zinc-700">
              <User size={16} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-8">
        {!selectedTicket ? (
          <div className="animate-in fade-in duration-700">
            
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight italic uppercase text-zinc-900">
                Good morning, Bhaiiiii
              </h1>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Real-time agentic reasoning for headless migration. System is healthy.
              </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Left Content */}
              <div className="col-span-9 space-y-8">
                <Header health={dashboardData.system_health} />
                <TicketTable
                  tickets={dashboardData.tickets}
                  onSelect={() => setSelectedTicket(ticketDetail)}
                />
              </div>

              {/* Right Sidebar */}
              <div className="col-span-3 sticky top-24">
                <SidebarCalendar />
              </div>

            </div>
          </div>
        ) : (
          <DetailView
            data={selectedTicket}
            onBack={() => setSelectedTicket(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
