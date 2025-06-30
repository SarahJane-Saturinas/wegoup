import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Dummy function to get current user id, replace with real auth logic
async function getCurrentUserId() {
  // TODO: Implement actual user authentication and return user id
  return 'some-user-id';
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const friends = await prisma.friend.findMany({
      where: {
        userId,
        status: 'accepted',
      },
      include: {
        friend: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ friends: friends.map((f: any) => f.friend) });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
