import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const plants = await prisma.tree.findMany({
      select: {
        id: true,
        name: true,
        species: true,
        plantedAt: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ plants });
  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
