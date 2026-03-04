import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isProtectedRoute = createRouteMatcher([
  '/cart',
  '/wishlist',
  '/profile',
  '/checkout',
  '/orders',
  '/orders(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();

  const getRole = async (): Promise<string | undefined> => {
    const claimsRole = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (claimsRole) return claimsRole;
    if (!userId) return undefined;
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return (user.publicMetadata as { role?: string } | null)?.role;
  };

  if (isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }
    const role = await getRole();
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
