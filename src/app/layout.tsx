import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainToolbar from '@/components/navigation/MainToolbar';
import SubToolbar from '@/components/navigation/SubToolbar';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cartwright Lustra 20260424',
  description: 'Self-hosted Next.js Database Frontend application on QNAP with MariaDB',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 min-h-screen flex flex-col text-slate-100`}>
        <div className="sticky top-0 z-50 w-full flex flex-col shadow-sm">
          {/* Level 1 Toolbar: Available across the entire app */}
          <MainToolbar session={session} />
          
          {/* Level 2 Toolbar: Dynamic based on route */}
          <SubToolbar session={session} />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
