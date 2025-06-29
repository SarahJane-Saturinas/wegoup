import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role only in backend
);

export async function syncProfile(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      username: user.username || user.firstName || 'unknown',
      avatar_url: user.imageUrl,
      bio: '',
    });

  if (error) {
    console.error('Failed to sync profile:', error);
    throw error;
  }
  return data;
}