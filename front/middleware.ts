import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(req: NextRequest) {
  // Define public paths that don't require authentication
  const isPublicPath = req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname === '/connexion' ||
    req.nextUrl.pathname === '/booking' ||
    req.nextUrl.pathname === '/inscription' ||
    req.nextUrl.pathname === '/faq' ||
    req.nextUrl.pathname === '/mentions-legales' ||
    req.nextUrl.pathname === '/politique-de-confidentialite' ||
    req.nextUrl.pathname === '/rules' ||
    req.nextUrl.pathname === '/contact' ||
    req.nextUrl.pathname === '/reset-password';

  // Check if the path is public or is a system path
  if (
    isPublicPath ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/connexion', req.url));
  }

  // Optionnel: restriction profil
  if (req.nextUrl.pathname.startsWith('/profil') && !token) {
    return NextResponse.redirect(new URL('/connexion', req.url));
  }

  return NextResponse.next();
}
