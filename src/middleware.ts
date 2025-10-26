import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run the middleware on static files
    '/', // Run the middleware on the index page
    '/(api|trpc)(.*)', // Run the middleware on API routes
  ],
};