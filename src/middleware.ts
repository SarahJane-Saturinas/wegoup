import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Add any custom configuration here if needed
});

export const config = {
  matcher: [
    /*
     * Match all API routes and protected pages that require authentication
     * Adjust the paths as per your app's structure
     */
    '/api/(.*)',
    '/community/friends/(.*)',
    '/dashboard/(.*)',
    '/planting/(.*)',
    '/chat/(.*)',
    '/profile',
    '/settings',
  ],
};
