import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET })
  
  const isAdminPath = request.nextUrl.pathname.startsWith('/dashboard') ||
                      request.nextUrl.pathname.startsWith('/links') ||
                      request.nextUrl.pathname.startsWith('/lists') ||
                      request.nextUrl.pathname.startsWith('/analytics') ||
                      request.nextUrl.pathname.startsWith('/settings')
  
  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/links/:path*',
    '/lists/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ]
}
