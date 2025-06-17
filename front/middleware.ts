import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/',
    '/connexion',
    '/booking',
    '/inscription',
    '/faq',
    '/mentions-legales',
    '/politique-de-confidentialite',
    '/rules',
    '/contact',
    '/reset-password',
    '/profil',
    '/admin/:path*',
  ]
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Liste des chemins publics
  const PUBLIC_PATHS = new Set([
    '/',
    '/connexion',
    '/booking',
    '/inscription',
    '/faq',
    '/mentions-legales',
    '/politique-de-confidentialite',
    '/rules',
    '/contact',
    '/reset-password'
  ])
  
  // Si c'est un chemin public, on laisse passer
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // Vérification du token
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  // Autoriser l'accès à toutes les autres routes si authentifié
  return NextResponse.next()
}
