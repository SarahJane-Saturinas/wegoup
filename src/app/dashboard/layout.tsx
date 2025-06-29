'use client';

import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white text-gray-800 font-inter">
      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
