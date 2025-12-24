import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Pages publiques (accessibles sans authentification)
const publicPaths = [
  '/',
  '/connexion',
  '/inscription',
  '/faq',
  '/mentions-legales',
  '/cgv',
  '/rules',
  '/contact',
  '/reset-password',
]

// Pages qui nécessitent une authentification
const protectedPaths = [
  '/profil',
  '/admin',
]

// Pages qui ne doivent être accessibles QUE depuis un redirect (pas directement)
const restrictedDirectAccess = [
  '/paiement/retour',
]

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ======================================
  // PROTECTION DES ROUTES API ADMIN
  // ======================================
  if (pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[API SECURITY] No authorization header on admin API route')
      return NextResponse.json(
        { error: 'Unauthorized - Token required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Enlever "Bearer "
    
    try {
      const decoded: DecodedToken = jwtDecode(token)
      const now = Date.now()
      const expiration = decoded.exp * 1000

      // Token expiré
      if (expiration < now) {
        console.log('[API SECURITY] Expired token on admin API route')
        return NextResponse.json(
          { error: 'Unauthorized - Token expired' },
          { status: 401 }
        )
      }

      // Vérifier que l'utilisateur est admin
      if (decoded.role !== 'ADMIN') {
        console.log('[API SECURITY] Non-admin user attempted to access admin API route')
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        )
      }

      // Token valide et utilisateur admin, autoriser l'accès
      console.log(`[API SECURITY] Admin API access granted for ${decoded.email}`)
      return NextResponse.next()

    } catch (error) {
      console.error('[API SECURITY] Invalid token on admin API route:', error)
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
  }

  // ======================================
  // PROTECTION DES PAGES WEB
  // ======================================

  // 1. Vérifier si c'est un chemin public (toujours autorisé)
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 2. Permettre l'accès aux pages du blog
  if (pathname.startsWith('/blog')) {
    return NextResponse.next()
  }

  // 3. Permettre /booking SEULEMENT avec sessionStorage (vérifié côté client)
  if (pathname === '/booking') {
    return NextResponse.next()
  }

  // 4. BLOQUER accès direct à /paiement/retour (doit venir de Stripe)
  if (restrictedDirectAccess.some(path => pathname.startsWith(path))) {
    const referer = request.headers.get('referer')
    const hasSessionId = request.nextUrl.searchParams.has('session_id')
    
    // Autoriser seulement si :
    // - Vient de Stripe (referer contient stripe.com)
    // - OU a un session_id valide dans l'URL
    if (!hasSessionId && (!referer || !referer.includes('stripe.com'))) {
      console.log('[SECURITY] Direct access to payment return page blocked')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    return NextResponse.next()
  }

  // 5. Vérifier l'authentification pour les pages protégées
  const token = request.cookies.get('token')

  if (!token) {
    console.log('[AUTH] No token found, redirecting to login')
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  // 6. Vérifier l'expiration et la validité du token
  try {
    const decoded: DecodedToken = jwtDecode(token.value)
    const now = Date.now()
    const expiration = decoded.exp * 1000 // Convertir en millisecondes

    // Token expiré
    if (expiration < now) {
      console.log('[AUTH] Token expired, redirecting to login')
      const response = NextResponse.redirect(new URL('/connexion', request.url))
      response.cookies.delete('token')
      return response
    }

    // 7. Vérification spécifique pour les pages admin
    if (pathname.startsWith('/admin')) {
      if (decoded.role !== 'ADMIN') {
        console.log('[AUTH] User is not admin, redirecting to home')
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Token valide, autoriser l'accès
    return NextResponse.next()

  } catch (error) {
    // Token invalide (malformé, signature invalide, etc.)
    console.error('[AUTH] Invalid token:', error)
    const response = NextResponse.redirect(new URL('/connexion', request.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * 1. /_next (Next.js internals)
     * 2. /_static (inside /public)
     * 3. /_vercel (Vercel internals)
     * 4. All files inside /public (e.g. /favicon.ico)
     * 
     * IMPORTANT: On INCLUT maintenant /api/admin pour protéger les routes API admin
     */
    '/((?!_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
    '/api/admin/:path*'
  ]
}
