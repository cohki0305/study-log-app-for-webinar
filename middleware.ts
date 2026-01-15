import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/logs', '/timer', '/badges', '/export']
const authRoutes = ['/login', '/verify']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('better-auth.session_token')

  // Protected routes - redirect to login if not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (authRoutes.some((route) => pathname === route)) {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Dashboard root - redirect based on auth status
  if (pathname === '/dashboard' || pathname === '/') {
    if (sessionToken && pathname === '/') {
      // If authenticated and on landing, stay on landing (user can choose to go to dashboard)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
