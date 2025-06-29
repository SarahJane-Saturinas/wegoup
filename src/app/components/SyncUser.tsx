// components/SyncUser.tsx
'use client';

import { useEffect } from 'react';

export default function SyncUser() {
  useEffect(() => {
    fetch('/api/create-user', { method: 'POST' });
  }, []);

  return null;
}
