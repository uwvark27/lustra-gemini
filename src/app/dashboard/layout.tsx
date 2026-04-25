export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-full">
      {/* Dashboard Page Content */}
      <div className="container mx-auto p-6">
        {children}
      </div>
    </section>
  );
}
