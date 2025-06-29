import { NextResponse } from 'next/server';

const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_URL = 'https://api.clerk.com/v1/users';

if (!CLERK_API_KEY) {
  throw new Error('CLERK_SECRET_KEY environment variable is not set');
}

export async function GET() {
  try {
    const res = await fetch(CLERK_API_URL, {
      headers: {
        Authorization: `Bearer ${CLERK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Clerk API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch users from Clerk' }, { status: 500 });
    }

    const data = await res.json();

    // Map Clerk users to simplified user objects
    const users = data.map((user: any) => ({
      id: user.id,
      fullName: user.full_name || user.first_name + ' ' + user.last_name,
      profileImageUrl: user.profile_image_url || null,
      email: user.email_addresses?.[0]?.email_address || '',
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching Clerk users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
