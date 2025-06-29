'use client';

import { SignUp } from '@clerk/nextjs';

interface SignUpContentProps {
  hideBackground?: boolean;
  hideHeading?: boolean;
}

export default function SignUpContent({ hideBackground = false, hideHeading = false }: SignUpContentProps) {
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
      {!hideHeading && <h1 style={{ marginBottom: '1rem', color: '#333' }}>Create an Account</h1>}
      <div style={{ width: '100%', maxWidth: '400px', padding: hideBackground ? '0' : '1rem' }}>
        <SignUp redirectUrl="/" />
      </div>
    </div>
  );
}
