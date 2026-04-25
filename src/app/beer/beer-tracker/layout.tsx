import PageTabs from '@/components/navigation/PageTabs';

const BeerTrackerTabs = [
  { name: 'Beer Checkin', href: '/beer/beer-tracker/beer-checkin' },
  { name: 'Beer Main', href: '/beer/beer-tracker/beer-main' },
  { name: 'Breweries', href: '/beer/beer-tracker/breweries' },
  { name: 'Beer Style', href: '/beer/beer-tracker/beer-style' },
  { name: 'Beer Series', href: '/beer/beer-tracker/beer-series' },
];

export default function BeerTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About the Beer</h1>
      
      <PageTabs tabs={BeerTrackerTabs} />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {children}
      </div>
    </div>
  );
}
