import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const publicRoutes = ['/', '/about', '/contact', '/login', '/register', '/forgot-password'];

const roleRouteMapping: Record<string, string[]> = {
  SUPER_ADMIN: ['/overview', '/regions', '/admins', '/fraud', '/analytics', '/settings'],
  REGIONAL_ADMIN: ['/overview', '/agents', '/smes', '/suppliers', '/kyc', '/disbursements'],
  SME_OWNER: ['/overview', '/wallet', '/orders', '/suppliers', '/loan', '/profile'],
  SUPPLIER: ['/overview', '/orders', '/escrow', '/wallet', '/catalog'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    const isPublic = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`/${route}/`) || pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname === '/favicon.ico'
    );

    if (isPublic) {
      return NextResponse.next();
    }

    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string;

    if (role && roleRouteMapping[role]) {
      const allowedPaths = roleRouteMapping[role];
      const isAllowed = allowedPaths.some((p) => pathname.startsWith(p));
      if (isAllowed) {
        return NextResponse.next();
      }
    }

    const roleDashboard: Record<string, string> = {
      SUPER_ADMIN: '/overview',
      REGIONAL_ADMIN: '/overview',
      SME_OWNER: '/overview',
      SUPPLIER: '/overview',
    };

    const dashboard = roleDashboard[role] || '/overview';
    return NextResponse.redirect(new URL(dashboard, req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|fundabiz-logo.svg|kenya-counties.svg).*)',
  ],
};
