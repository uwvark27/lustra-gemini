import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Initialize NextAuth in Edge environment without the database adapter
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  // Default to 'user' if no role is explicitly set
  const role = ((req.auth?.user as any)?.role || 'user').toLowerCase();
  const path = req.nextUrl.pathname;

  // Define public and authentication routes
  const isPublicRoute = path === '/' || path.startsWith('/cartwright-sites');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  // 1. If hitting login/register while logged in, redirect to home
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/', req.nextUrl));
    }
    return; // Allow guests to access login/register
  }

  // 2. If not logged in and trying to access a protected route, send to login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // 3. If logged in, enforce role-based access
  if (isLoggedIn) {
    if (role === 'admin') {
      return; // Admin gets full access to everything
    }

    if (role === 'super') {
      if (path.startsWith('/admin')) {
        return Response.redirect(new URL('/', req.nextUrl));
      }
      return; // Super gets access to everything else
    }

    // Standard user (only public routes allowed)
    if (!isPublicRoute) {
      return Response.redirect(new URL('/', req.nextUrl));
    }
  }
});

// Configure the paths where the middleware should run
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};