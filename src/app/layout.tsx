import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatProvider } from './components/ChatModal';
import { metadata } from './metadata';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ChatProvider>
        <html lang="en">
          <body className={inter.className}>
            <AuthGate>
              <Navbar />
              {children}
            </AuthGate>
          </body>
        </html>
      </ChatProvider>
    </ClerkProvider>
  );
}
