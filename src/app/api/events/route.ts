import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return static events data as Prisma Event model is not yet supported
    const events = [
      {
        id: '1',
        title: 'Urban Forest Initiative',
        date: '2024-06-12T20:33:00Z',
        location: 'Golden Gate Park, San Francisco',
        attending: 0,
        active: true,
      },
      {
        id: '2',
        title: 'Community Garden Workshop',
        date: '2024-06-16T20:33:00Z',
        location: 'Mission Community Garden, SF',
        attending: 1,
        active: true,
      },
      {
        id: '3',
        title: 'Coastal Restoration Project',
        date: '2024-06-19T20:33:00Z',
        location: 'Ocean Beach, San Francisco',
        attending: 0,
        active: true,
      },
    ];

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
