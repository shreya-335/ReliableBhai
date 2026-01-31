import React, { useState } from 'react';
import Header from './components/Header';
import TicketTable from './components/TicketTable';
import DetailView from './components/DetailView'; // Import new component
import { dashboardData, ticketDetail } from './data/mockData';
import { Search, Bell, User } from 'lucide-react';

function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Helper to handle row click (we'll pass this to TicketTable)
  const handleTicketClick = (ticketId) => {
    // In a real app, you'd fetch data here. For now, we use our mock detail.
    setSelectedTicket(ticketDetail);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <nav className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="font-black text-xl tracking-tighter italic">SELF_HEAL v1.0</div>
          <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <span className={`${!selectedTicket ? 'text-ink border-b-2 border-ink pb-4' : ''}`}>Command Center</span>
            <span>Patterns</span>
            <span>Logs</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <Search size={18} />
          <Bell size={18} />
          <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600">
            <User size={16} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-8">
        {!selectedTicket ? (
          <>
            <div className="flex justify-between items-end mb-8 text-fade-in">
              <div>
                <h1 className="text-3xl font-light tracking-tight">System Awareness</h1>
                <p className="text-zinc-500 text-sm">Real-time agentic reasoning for headless migration.</p>
              </div>
            </div>
            <Header health={dashboardData.system_health} />
            {/* Added onSelect handler */}
            <TicketTable tickets={dashboardData.tickets} onSelect={handleTicketClick} />
          </>
        ) : (
          <DetailView data={selectedTicket} onBack={() => setSelectedTicket(null)} />
        )}
      </main>
    </div>
  );
}

export default App;