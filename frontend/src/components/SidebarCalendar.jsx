import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { Settings, Database } from 'lucide-react';

const SidebarCalendar = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  return (
    <div className="bg-white rounded-[32px] p-6 border border-black/5 shadow-sm space-y-8">
      
      {/* Calendar */}
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest mb-4">
          {format(selectedDay, 'MMMM yyyy')}
        </p>

        {/* Constrained calendar wrapper */}
        <div className="flex justify-center overflow-hidden">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            weekStartsOn={1}
            showOutsideDays={false}
            numberOfMonths={1}
            className="rdp-custom max-w-full"
            modifiersClassNames={{
              selected: 'rdp-selected',
              today: 'rdp-today'
            }}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => console.log('Scheduled for', selectedDay)}
        className="w-full bg-zinc-900 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition"
      >
        Schedule Reboot
      </button>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mb-4">
          Recent Sessions
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Settings size={14} />
            </div>
            <div>
              <p className="text-[10px] font-bold">Pattern Analysis</p>
              <p className="text-[8px] text-zinc-400">
                Completed by AI Agent v4.2
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Database size={14} />
            </div>
            <div>
              <p className="text-[10px] font-bold">DB Optimization</p>
              <p className="text-[8px] text-zinc-400">
                In-progress automated job
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarCalendar;
