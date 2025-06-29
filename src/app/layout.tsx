// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatProvider } from './components/ChatModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WEGOUP',
  description: 'Tree Planting Web App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ChatProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
          </body>
        </html>
      </ChatProvider>
    </ClerkProvider>
  );
}
