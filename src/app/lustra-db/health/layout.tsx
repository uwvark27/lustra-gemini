import PageTabs from '@/components/navigation/PageTabs';

const HealthTabs = [
  { name: 'Activities', href: '/lustra-db/health/activities' },
  { name: 'Weight', href: '/lustra-db/health/weight' },
  { name: 'Personal Care', href: '/lustra-db/health/personal-care' },
  { name: 'Health Log', href: '/lustra-db/health/health-log' },
];

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About our Health</h1>
      
      <PageTabs tabs={HealthTabs} />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {children}
      </div>
    </div>
  );
}
