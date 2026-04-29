'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

// Helper functions to strictly use local time and avoid timezone shifting issues
const getLocalYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseYYYYMMDD = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Reliable day of year calculation using UTC to avoid Daylight Savings bugs
const getDayOfYear = (date: Date) => {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((current - start) / (1000 * 60 * 60 * 24));
};

export default function DateController({ 
  selectedDate, 
  onChange 
}: { 
  selectedDate: Date;
  onChange: (date: Date) => void;
}) {

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onChange(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(parseYYYYMMDD(e.target.value));
    }
  };

  const today = new Date();
  const isToday = getLocalYYYYMMDD(selectedDate) === getLocalYYYYMMDD(today);
  const inputValue = getLocalYYYYMMDD(selectedDate);

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 mb-8 w-full max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Headers */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Today in Lustra
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Today is <button onClick={() => onChange(new Date())} className="underline decoration-dotted underline-offset-4 hover:text-slate-300 transition-colors" title="Reset to today">
              {today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </button>
          </p>
        </div>

        {/* Right Side: Interactive Date Controller */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg p-1 shadow-sm">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-300" title="Previous Day">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative flex items-center px-2">
              <input type="date" value={inputValue} onChange={handleDateChange} className="bg-transparent border-none focus:ring-0 text-slate-100 font-semibold cursor-pointer outline-none" style={{ colorScheme: 'dark' }} />
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-300" title="Next Day">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {isToday ? 'Viewing Today' : selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} 
            {' '}• Day {getDayOfYear(selectedDate)} of {selectedDate.getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
