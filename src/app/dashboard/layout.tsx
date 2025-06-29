'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white text-gray-800 font-inter">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold text-green-700 hover:text-green-800 transition-colors">
            🌱 WEGOUP
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-2 text-sm font-medium">
            <NavLink href="/dashboard" label="Dashboard" />
            <NavLink href="/plants" label="BotaniHub" />
            <NavLink href="/chat" label="AI Chatbot" />
            <NavLink href="/community" label="Community" />
          </nav>

          {/* User Button */}
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

// Reusable NavLink with modern hover
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg hover:bg-green-100 text-gray-700 hover:text-green-700 transition-all duration-200"
    >
      {label}
    </Link>
  );
}
