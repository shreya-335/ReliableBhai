import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SupportSimulator from './pages/SupportSimulator';
import SystemEventsSimulator from './pages/SystemEventsSimulator';

function App() {
  const [currentPage, setCurrentPage] = useState('support'); // 'support' | 'system'

  return (
    <div className="flex min-h-screen bg-[#F9F6F1]">
      <Sidebar activePage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 px-12 overflow-y-auto">
        {currentPage === 'support' ? (
          <SupportSimulator />
        ) : (
          <SystemEventsSimulator />
        )}
      </main>
    </div>
  );
}

export default App;