import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Définis ici toutes les routes publiques que tu veux exclure de la protection
  const publicPaths = ['/', '/connexion', '/booking', '/inscription', '/faq', '/mentions-legales', '/politique-de-confidentialite', '/rules', '/contact'];
  // Regex pour détecter les fichiers statiques/assets
  const isAsset = /\.(png|jpg|jpeg|svg|webp|ico|gif|css|js|woff2?|ttf|eot|otf|mp4|webm|json)$/i.test(req.nextUrl.pathname);

  if (
    publicPaths.includes(req.nextUrl.pathname) ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    isAsset
  ) {
    return NextResponse.next();
  }

  // Récupère le token des cookies
  const token = req.cookies.get('token')?.value;
  // Si pas de token, redirige vers la page de connexion
  if (!token) {
    return NextResponse.redirect(new URL('/connexion', req.url));
  }

  // Appelle ton endpoint d'authentification pour vérifier le rôle de l'utilisateur
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/whoIAm`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Ici, tu dois avoir dans la réponse un nombre (role)
  const role = parseInt(await res.text());

  // Restriction sur les routes admin
  if (req.nextUrl.pathname.startsWith('/admin') && role !== 1) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/profil') && !token) {
    return NextResponse.redirect(new URL('/connexion', req.url));
  }

  // Sinon, tout va bien !
  return NextResponse.next();
}
