'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isSignedIn) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
