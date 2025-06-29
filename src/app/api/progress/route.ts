import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // For demo, returning static progress data; replace with real user progress logic
    const progressData = [
      {
        title: 'Tree Planter',
        progress: 12,
        goal: 25,
        description: 'Plant 25 trees to unlock next badge',
        color: 'bg-green-600',
      },
      {
        title: 'Community Leader',
        progress: 7,
        goal: 10,
        description: 'Organize 10 events to unlock badge',
        color: 'bg-yellow-600',
      },
    ];

    return NextResponse.json({ progressData });
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
