'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
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
          <NavLink href="/events" label="Events" />
          <NavLink href="/chat" label="AI Chatbot" />
          <NavLink href="/community" label="Community" />
        </nav>

        {/* User Button */}
<UserButton afterSignOutUrl="/auth/sign-in" />
      </div>
    </header>
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
