'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatProvider } from './components/ChatModal';
import { metadata } from './metadata';
import Navbar from './components/Navbar';

import { usePathname } from 'next/navigation';
import AuthGate from './components/AuthGate';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthRoute = pathname?.startsWith('/auth');

  return (
    <ClerkProvider>
      <ChatProvider>
        <html lang="en">
          <body className={inter.className}>
            {!isAuthRoute ? (
              <AuthGate>
                <Navbar />
                {children}
              </AuthGate>
            ) : (
              children
            )}
          </body>
        </html>
      </ChatProvider>
    </ClerkProvider>
  );
}
