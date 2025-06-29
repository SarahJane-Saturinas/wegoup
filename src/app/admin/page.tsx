'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!user || !isLoaded) return;

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data?.role !== 'admin') {
        router.push('/not-authorized');
      } else {
        setRole('admin');
      }
    };

    checkRole();
  }, [user, isLoaded, router]);

  if (role !== 'admin') return null;

  return <div className="p-6 text-xl font-bold">Welcome, Admin!</div>;
}
