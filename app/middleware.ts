// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public pages that don't require authentication
const PUBLIC_PAGES = [
  '/',
  '/login',
  '/register',
  '/contact',
  '/blog',
  '/blogs',
  '/court-marriage',
  '/hinduism-sikhism-buddhism-jainism',
  '/islam',
  '/christianity',
  '/other',
];

// Authentication required pages (private)
const PRIVATE_PAGES = [
  '/account',
  '/profile',
  '/my-subscription',
  '/dashboard',
  '/documents',
  '/payment',
  '/subscription',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies (set by your auth system)
  const token = request.cookies.get('rmm_token')?.value;
  
  // Check if user is authenticated
  const isAuthenticated = !!token;

  // If user is authenticated and tries to access login or register page
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if current path is a private page
  const isPrivatePage = PRIVATE_PAGES.some(page => 
    pathname === page || pathname.startsWith(`${page}/`)
  );
  
  // If user is NOT authenticated and tries to access a private page
  if (!isAuthenticated && isPrivatePage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For all other cases, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};