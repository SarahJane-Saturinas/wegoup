import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Query count of trees planted by the user
    const treesPlantedCount = await prisma.tree.count({
      where: { userId },
    });

    // TODO: Add logic for events organized by user when available
    const eventsOrganizedCount = 0;

    const progressData = [
      {
        title: 'Tree Planter',
        progress: treesPlantedCount,
        goal: 25,
        description: 'Plant 25 trees to unlock next badge',
        color: 'bg-green-600',
      },
      {
        title: 'Community Leader',
        progress: eventsOrganizedCount,
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
