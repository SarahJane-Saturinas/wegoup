import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_URL = 'https://api.clerk.com/v1/users';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Post content cannot be empty' }, { status: 400 });
    }

    let user: any = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      if (!CLERK_API_KEY) {
        console.error('CLERK_SECRET_KEY environment variable is not set');
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }

      // Fetch user details from Clerk API
      const res = await fetch(`${CLERK_API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${CLERK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Failed to fetch user from Clerk API:', await res.text());
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }

      const clerkUser = await res.json();
      const fullName = clerkUser.full_name || `${clerkUser.first_name} ${clerkUser.last_name}`;
      const email = clerkUser.email_addresses?.[0]?.email_address || '';

      if (!user) {
        // Create user record if not found
        user = await prisma.user.create({
          data: {
            id: userId,
            email,
            fullName,
          },
        });
      } else if (!user.fullName || user.fullName === 'Anonymous') {
        // Update user fullName if empty or Anonymous
        user = await prisma.user.update({
          where: { id: userId },
          data: { fullName, email },
        });
      }
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        userName: user.fullName,
        userInitial: user.fullName ? user.fullName.charAt(0) : 'A',
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId: loggedInUserId } = getAuth(request);

    if (!loggedInUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const profileUserId = url.searchParams.get('userId');

    let posts;

    if (profileUserId) {
      // Fetch posts for the profile user only
      posts = await prisma.post.findMany({
        where: { userId: profileUserId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      });
    } else {
      // Fetch posts from logged-in user and friends (newsfeed)
      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            { userId: loggedInUserId, status: 'accepted' },
            { friendId: loggedInUserId, status: 'accepted' },
          ],
        },
      });

      const friendUserIds = friends.map((f) =>
        f.userId === loggedInUserId ? f.friendId : f.userId
      );

      const userAndFriendIds = [loggedInUserId, ...friendUserIds];

      posts = await prisma.post.findMany({
        where: {
          userId: { in: userAndFriendIds },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      });
    }

    const formattedPosts = posts.map((p: any) => {
      const user = p.user as any;
      return {
        id: p.id,
        userName: user?.fullName || 'Anonymous',
        userInitial: user?.fullName ? user.fullName.charAt(0) : 'A',
        content: p.content,
        createdAt: p.createdAt.toISOString(),
        location: undefined,
        imageUrl: undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        badge: undefined,
      };
    });

    return NextResponse.json(formattedPosts);
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
