import { redirect } from 'next/navigation';

export default function BeerTrackerPage() {
// Automatically redirect to the first tab when visiting the base Beer Tracker route
  redirect('/beer/beer-tracker/beer-checkin');
  return null;
}
