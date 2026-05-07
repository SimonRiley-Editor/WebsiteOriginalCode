import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const authCookie = request.cookies.get('admin_auth');
    
    // If no cookie exists, redirect to login
    if (!authCookie || !authCookie.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Try to verify the JWT
    const payload = await verifyJwt(authCookie.value);
    
    // If verification fails (null), redirect to login
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
