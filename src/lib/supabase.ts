import { useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Hook to get a Supabase client with Clerk JWT attached
export function useSupabaseWithAuth() {
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const setup = async () => {
      const token = await getToken({ template: 'supabase' });
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      setSupabase(client);
    };
    setup();
  }, [getToken]);

  return supabase;
}
