import PageTabs from '@/components/navigation/PageTabs';

const AutoTabs = [
  { name: 'Gas Log', href: '/lustra-db/auto/gas-log' },
  { name: 'Auto Stats', href: '/lustra-db/auto/auto-stats' },
  { name: 'Auto Log', href: '/lustra-db/auto/auto-log' },
];

export default function AutoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About our Auto</h1>
      
      <PageTabs tabs={AutoTabs} />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {children}
      </div>
    </div>
  );
}
