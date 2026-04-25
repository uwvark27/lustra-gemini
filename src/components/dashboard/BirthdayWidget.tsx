'use client';

import { useEffect, useState } from 'react';
import { Gift, Cake, Skull } from 'lucide-react';
import { getBirthdaysForDate, getDeathdaysForDate } from '@/app/actions/dashboard';

export default function BirthdayWidget({ selectedDate }: { selectedDate: Date }) {
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [deathdays, setDeathdays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();
      
      try {
        const [bdayData, ddayData] = await Promise.all([
          getBirthdaysForDate(month, day),
          getDeathdaysForDate(month, day)
        ]);
        if (isMounted) {
          setBirthdays(bdayData);
          setDeathdays(ddayData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard events", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => { 
      isMounted = false; 
    };
  }, [selectedDate]);

  const targetYear = selectedDate.getFullYear();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 w-full max-w-5xl mb-8">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-pink-500" />
        Birthdays & Memorials
      </h3>
      
      {isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
      ) : birthdays.length === 0 && deathdays.length === 0 ? (
        <p className="text-slate-500 text-sm">No birthdays or memorials on this date.</p>
      ) : (
        <div className="space-y-6">
          {birthdays.length > 0 && (
            <ul className="space-y-3">
              {birthdays.map((person) => {
                const birthYear = person.birthday ? new Date(person.birthday).getFullYear() : targetYear;
                const age = targetYear - birthYear;
                
                if (person.deathday) {
                  const deathDate = new Date(person.deathday);
                  const formattedDeathday = deathDate.toLocaleDateString(undefined, { 
                    timeZone: 'UTC', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });

                  return (
                    <li key={person.id} className="flex items-start gap-3 text-slate-600">
                      <Skull className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                      <span>
                        <span className="font-medium text-slate-900">{person.firstName} {person.lastName}</span> 
                        {' '}would have been {age} {age === 1 ? 'year' : 'years'} old today, but sadly passed away on {formattedDeathday}.
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={person.id} className="flex items-start gap-3 text-slate-700">
                    <Cake className="w-4 h-4 mt-1 text-pink-500 shrink-0" />
                    <span>
                      <span className="font-medium text-slate-900">{person.firstName} {person.lastName}</span> 
                      {' '}is {age} {age === 1 ? 'year' : 'years'} old today! 🎉
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          
          {deathdays.length > 0 && (
            <ul className="space-y-3">
              {deathdays.map((person) => {
                const deathYear = person.deathday ? new Date(person.deathday).getFullYear() : targetYear;
                const yearsAgo = targetYear - deathYear;
                
                return (
                  <li key={`death-${person.id}`} className="flex items-start gap-3 text-slate-600">
                    <Skull className="w-4 h-4 mt-1 text-slate-400 shrink-0" />
                    <span>
                      <span className="font-medium text-slate-900">{person.firstName} {person.lastName}</span> 
                      {' '}passed away {yearsAgo} {yearsAgo === 1 ? 'year' : 'years'} ago in {deathYear}.
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
