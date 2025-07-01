import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';

const clerkApiKey = process.env.CLERK_API_KEY || '';

export async function syncClerkUsersToPrisma() {
  try {
    const clerkUsers = await users.getUserList();

    for (const user of clerkUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            fullName: user.firstName + ' ' + user.lastName,
            profileImageUrl: user.profileImageUrl,
          },
        });
      }
    }
    console.log('Clerk users synchronized to Prisma database.');
  } catch (error) {
    console.error('Error syncing Clerk users to Prisma:', error);
  }
}
