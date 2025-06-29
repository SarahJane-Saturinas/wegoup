// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect all these routes
    '/dashboard(.*)',
    '/admin(.*)',
    '/profile(.*)',
    '/plants(.*)',
    '/events(.*)',
    
    // Optional: protect API routes if you want
    '/api/(.*)',
  ],
};
