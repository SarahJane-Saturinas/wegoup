'use client';

import { SignIn } from '@clerk/nextjs';

interface SignInContentProps {
  hideBackground?: boolean;
  hideHeading?: boolean;
}

export default function SignInContent({ hideBackground = false, hideHeading = false }: SignInContentProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: hideBackground ? '0' : '2rem',
        backgroundColor: hideBackground ? 'transparent' : '#f0f4f8',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {!hideHeading && <h1 style={{ marginBottom: '1rem', color: '#333' }}>Welcome Back! Please Sign In</h1>}
      <div style={{ width: '100%', maxWidth: '400px', padding: hideBackground ? '0' : '1rem' }}>
        <SignIn redirectUrl="/dashboard" routing="hash" />
      </div>
    </div>
  );
}
