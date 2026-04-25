import PageTabs from '@/components/navigation/PageTabs';

const HouseholdTabs = [
  { name: 'Tasks', href: '/lustra-db/household/tasks' },
  { name: 'Purchases', href: '/lustra-db/household/purchases' },
  { name: 'Electricity', href: '/lustra-db/household/electricity' },
  { name: 'Household Log', href: '/lustra-db/household/household-log' },
];

export default function HouseholdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About the Household</h1>
      
      <PageTabs tabs={HouseholdTabs} />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {children}
      </div>
    </div>
  );
}
