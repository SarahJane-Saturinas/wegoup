'use client';

import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="flex justify-between items-center bg-green-100 p-4 shadow-md">
      <Link href="/" className="text-2xl font-bold text-green-700">🌱 WEGOUP</Link>
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Link href="/dashboard" className="text-green-800 font-semibold">Dashboard</Link>
            <UserButton afterSignOutUrl="/sign-in" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="bg-green-500 text-white px-4 py-2 rounded">Sign In</button>
            </SignInButton>
          </>
        )}
      </div>
    </nav>
  );
}
