// components/RoleGate.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function RoleGate({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user } = useUser();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      setHasAccess(data?.role === allowedRole);
    };

    checkRole();
  }, [user]);

  if (!hasAccess) return null;

  return <>{children}</>;
}
