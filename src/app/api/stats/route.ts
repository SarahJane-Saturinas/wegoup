import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Count of trees planted from tree model
    const treesPlantedCount = await prisma.tree.count();

    // Count of active members (total users)
    const activeMembersCount = await prisma.user.count();

    return NextResponse.json({
      treesPlanted: treesPlantedCount,
      activeMembers: activeMembersCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
