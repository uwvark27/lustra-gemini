'use client';

import { useState } from 'react';
import DateController from './DateController';
import BirthdayWidget from './BirthdayWidget';

export default function DashboardWidgets() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <DateController selectedDate={selectedDate} onChange={setSelectedDate} />
      <BirthdayWidget selectedDate={selectedDate} />
    </>
  );
}