import PageTabs from '@/components/navigation/PageTabs';

const aboutUsTabs = [
  { name: 'Marc', href: '/cartwright-sites/about-us/marc' },
  { name: 'Alejandra', href: '/cartwright-sites/about-us/alejandra' },
  { name: 'Isaac', href: '/cartwright-sites/about-us/isaac' },
  { name: 'Pax', href: '/cartwright-sites/about-us/pax' },
  { name: 'Lyra', href: '/cartwright-sites/about-us/lyra' },
];

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About the Family</h1>
      
      <PageTabs tabs={aboutUsTabs} />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {children}
      </div>
    </div>
  );
}
