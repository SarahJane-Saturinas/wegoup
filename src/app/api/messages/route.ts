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
    const body = await req.json();
    console.log('POST /api/messages body:', body);

    const userId = await getCurrentUserId();
    console.log('POST /api/messages userId:', userId);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing receiverId or content' }, { status: 400 });
    }

    let message;
    try {
      message = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId,
          content,
        },
      });
    } catch (prismaError) {
      console.error('Prisma error creating message:', prismaError);
      return NextResponse.json({ error: 'Database error creating message' }, { status: 500 });
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Error sending message:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    const errorMessage = error?.message || JSON.stringify(error) || 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
