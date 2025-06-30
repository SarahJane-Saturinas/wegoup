import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, species, plantedAt } = body;

  if (!name || !species || !plantedAt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const tree = await prisma.tree.create({
      data: {
        name,
        species,
        plantedAt: new Date(plantedAt),
        userId,
      },
    });
    return NextResponse.json(tree);
  } catch (error) {
    console.error('Error creating tree:', error);
    return NextResponse.json({ error: 'Failed to create tree' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const community = url.searchParams.get('community');

  if (community !== 'true') {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    if (community === 'true') {
      // Return total count of all trees planted by all users
      const count = await prisma.tree.count();
      return NextResponse.json({ count });
    } else {
      // userId is already checked above, safe to use
      const { userId } = getAuth(request);
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // Return trees for the authenticated user
      const trees = await prisma.tree.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          species: true,
          plantedAt: true,
        },
      });
      return NextResponse.json(trees);
    }
  } catch (error) {
    console.error('Error fetching trees:', error);
    return NextResponse.json({ error: 'Failed to fetch trees' }, { status: 500 });
  }
}
