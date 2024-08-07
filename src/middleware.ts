import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookies = parse(request.headers.get('cookie') || '');
  
  if (cookies.jwtAccessToken && cookies.jwtAccessToken.length > 0) {
    try {
      // Replace 'your-secret-key' with your actual secret key
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(cookies.jwtAccessToken, secret);
      return NextResponse.next();
    } catch (err) {
      console.error('JWT verification failed:', err);
    }
  }

  return NextResponse.redirect(new URL('/admin-login', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
        '/admin',
        '/api/edit-news',
        '/api/author_profile',
        '/api/get_author_articles',
        '/api/create-category',
        '/api/create-author',
    ],
};
