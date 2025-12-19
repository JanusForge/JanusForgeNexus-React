import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = ['/debates', '/profile', '/billing', '/admin'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Get auth token from cookies (simplified - in reality use proper auth)
  const token = request.cookies.get('janusforge_auth');
  const userRole = request.cookies.get('user_role')?.value || 'guest';

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect non-admins away from admin routes
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
