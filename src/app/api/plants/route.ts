import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      select: {
        id: true,
        name: true,
        scientificName: true,
        climate: true,
        imageUrl: true,
        tags: true,
        isNative: true,
      },
    });

    return NextResponse.json({ plants });
  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
