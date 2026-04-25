'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface Tab {
  name: string;
  href: string;
}

export default function PageTabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <div className="w-full mb-6">
      {/* overflow-x-auto makes it horizontally swipeable on mobile, and the arbitrary classes hide the ugly scrollbar */}
      <nav className="flex space-x-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}