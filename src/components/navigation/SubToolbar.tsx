'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const subMenuMap: Record<string, { name: string; href: string }[]> = {
  '/admin': [
    { name: 'Places', href: '/admin/places' },
    { name: 'Entities', href: '/admin/entities' },
    { name: 'Lifelog', href: '/admin/lifelog' },
    { name: 'Attributes', href: '/admin/attributes' },
    { name: 'Franchises', href: '/admin/franchises' },
    { name: 'Brands', href: '/admin/brands' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Roles', href: '/admin/roles' },
    { name: 'Settings', href: '/admin/settings' },
  ],
  '/cartwright-sites': [
    { name: 'Family Feed', href: '/cartwright-sites/family-feed' },
    { name: 'Beerjuvenation', href: '/cartwright-sites/beerjuvenation' },
    { name: 'Xmas Photos', href: '/cartwright-sites/xmas-photos' },
    { name: 'School Photos', href: '/cartwright-sites/school-photos' },
    { name: 'About Us', href: '/cartwright-sites/about-us' },
    { name: 'Monthly Us', href: '/cartwright-sites/monthly-us' },
  ],
  '/lustra-db': [
    { name: 'Household', href: '/lustra-db/household' },
    { name: 'Health', href: '/lustra-db/health' },
    { name: 'Auto', href: '/lustra-db/auto' },
    { name: 'Education', href: '/lustra-db/education' },
    { name: 'Links', href: '/lustra-db/links' },
  ],
  '/beer': [
    { name: 'Beer Tracker', href: '/beer/beer-tracker' },
    { name: 'Brewery Log', href: '/beer/brewery-log' },
    { name: 'Beer Map', href: '/beer/beer-map' },
    { name: 'Beer Stats', href: '/beer/beer-stats' },
  ],
  '/media': [
    { name: 'Book', href: '/media/book' },
    { name: 'Comic Book', href: '/media/comic-book' },
    { name: 'Games', href: '/media/games' },
    { name: 'Movies', href: '/media/movies' },
    { name: 'TV Shows', href: '/media/tv-shows' },
    { name: 'Music', href: '/media/music' },
  ],
  '/events': [
    { name: 'Event Checkin', href: '/events/event-checkin' },
    { name: 'Weird Al', href: '/events/weird-al' },
    { name: 'Concerts', href: '/events/concerts' },
    { name: 'Sports', href: '/events/sports' },
  ],
};

export default function SubToolbar() {
  const pathname = usePathname();

  // Determine which main section we are in to show the correct sub-links
  const currentSection = Object.keys(subMenuMap).find((path) => 
    pathname.startsWith(path)
  );
  
  const subLinks = currentSection ? subMenuMap[currentSection] : [];

  if (subLinks.length === 0) return null; // Hide sub-toolbar if no links match

  return (
    <div className="bg-slate-100 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-10 flex justify-center space-x-6 text-sm font-semibold text-slate-600">
        {subLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.href} href={link.href} className={`relative flex items-center h-full transition-colors ${isActive ? 'text-blue-600' : 'hover:text-blue-500'}`}>
              {link.name}
              {isActive && (
                <span className="absolute left-1/2 bottom-0 h-[3px] w-1.5 -translate-x-1/2 rounded-t-full bg-blue-600 shadow-[0_0_8px_1px_rgba(37,99,235,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
