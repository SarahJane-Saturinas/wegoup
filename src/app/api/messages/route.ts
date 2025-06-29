import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { auth } from '@clerk/nextjs/server';


// Updated function to get current user id from Clerk auth or fallback to DB
async function getCurrentUserId() {
  const authResult = await auth();
  const userId = authResult.userId;
  if (userId) {
    return userId;
  }
  // Fallback to first user in DB
  const user = await prisma.user.findFirst();
  return user ? user.id : null;
}

export async function GET(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const otherUserId = url.searchParams.get('otherUserId');
    if (!otherUserId) {
      return NextResponse.json({ error: 'Missing otherUserId parameter' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing receiverId or content' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content,
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
