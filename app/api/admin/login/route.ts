import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signJwt } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin'; // Fallback for preview environment

  if (password === adminPassword) {
    // Generate a secure JWT instead of a plain-text boolean
    const token = await signJwt({ role: 'admin', authenticated: true });
    
    (await cookies()).set('admin_auth', token, {
      httpOnly: true,
      secure: true, // Required for sameSite: 'none'
      sameSite: 'none', // Required for iframe preview
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
