'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logout } from '../../app/actions/auth';
import type { Session } from 'next-auth';

const navLinks = [
  { name: 'Cartwright Sites', href: '/cartwright-sites' },
  { name: 'LustraDB', href: '/lustra-db' },
  { name: 'Beer', href: '/beer' },
  { name: 'Media', href: '/media' },
  { name: 'Events', href: '/events' },
  { name: 'Admin', href: '/admin' },
];

export default function MainToolbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const role = ((session?.user as any)?.role || 'user').toLowerCase();

  const visibleLinks = navLinks.filter(link => {
    if (role === 'admin') return true; // Admins see all
    if (role === 'super') return link.href !== '/admin'; // Supers see all except admin
    return link.href === '/cartwright-sites'; // Users only see Cartwright Sites
  });

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Left Side: Logo */}
        <div className="flex-1 flex items-center h-full py-2">
          <Link href="/" className="block h-full">
            <Image 
              src="/cartconn_web.png" 
              alt="Cartwright Connect" 
              width={400} 
              height={150} 
              className="h-full w-auto object-contain"
              quality={100}
              priority 
            />
          </Link>
        </div>
        
        {/* Center: Navigation */}
        <nav className="flex space-x-6 font-medium text-sm h-full justify-center">
          {visibleLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`relative flex items-center h-full transition-colors ${isActive ? 'text-blue-400' : 'hover:text-blue-300'}`}>
                {link.name}
                {isActive && (
                  <span className="absolute left-1/2 bottom-0 h-[3px] w-1.5 -translate-x-1/2 rounded-t-full bg-blue-400 shadow-[0_0_8px_1px_rgba(96,165,250,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Right Side: Auth */}
        <div className="flex-1 flex justify-end items-center h-full">
          <div className="flex items-center">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-300 hidden sm:block">{session.user.name}</span>
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 overflow-hidden shadow-sm">
                  <svg className="w-5 h-5 text-slate-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <form action={logout}>
                  <button type="submit" className="text-slate-400 hover:text-white transition-colors" title="Log out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-slate-300 hover:text-white text-sm font-semibold transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
