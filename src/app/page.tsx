import { auth } from '@/auth';
import Link from 'next/link';
import Image from 'next/image';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';

export default async function Home() {
  const session = await auth();
  // Determine the user's role, defaulting to 'guest' if they aren't logged in
  const role = ((session?.user as any)?.role || 'guest').toLowerCase();

  return (
    <div className="container mx-auto p-6 flex flex-col items-center min-h-[calc(100vh-104px)] pt-12">
      <div className="max-w-3xl flex flex-col items-center text-center space-y-6 mb-12">
        <Image 
          src="/cartconn_web.png" 
          alt="Cartwright Connect" 
          width={600} 
          height={200} 
          className="w-full max-w-md md:max-w-lg h-auto object-contain drop-shadow-sm mb-4"
          quality={100}
          priority 
        />
      </div>

      {/* Interactive Dashboard Widgets */}
      <DashboardWidgets />

      {/* Role-Specific Content Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visible to Everyone (Guest, User, Super, Admin) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Cartwright Sites</h2>
          <p className="text-slate-600 mb-4">Explore the public family feeds, photo galleries, and about us pages.</p>
          <Link href="/cartwright-sites" className="text-blue-600 hover:text-blue-700 font-medium">Browse Sites &rarr;</Link>
        </div>

        {/* Visible to Super and Admin */}
        {(role === 'super' || role === 'admin') && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 bg-blue-50/30">
            <h2 className="text-xl font-bold text-blue-900 mb-3">LustraDB Access</h2>
            <p className="text-blue-800/80 mb-4">Access and manage the underlying databases for Household, Health, Auto, and Education.</p>
            <Link href="/lustra-db" className="text-blue-700 hover:text-blue-800 font-semibold">Open LustraDB &rarr;</Link>
          </div>
        )}

        {/* Visible to Admin Only */}
        {role === 'admin' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-200 bg-purple-50/40">
            <h2 className="text-xl font-bold text-purple-900 mb-3">System Administration</h2>
            <p className="text-purple-800/80 mb-4">Manage system users, roles, core entities, and application settings.</p>
            <Link href="/admin" className="text-purple-700 hover:text-purple-800 font-semibold">Open Admin Panel &rarr;</Link>
          </div>
        )}
      </div>
    </div>
  );
}
