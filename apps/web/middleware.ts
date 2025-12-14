import { auth } from './lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  const isHealthRoute = req.nextUrl.pathname === '/api/health';

  // Allow health check and auth routes without authentication
  if (isHealthRoute || isAuthRoute) {
    return NextResponse.next();
  }

  // Protect other API routes
  if (isApiRoute && !isLoggedIn) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
