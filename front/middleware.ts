import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const publicPaths = [
    '/', '/connexion', '/booking', '/inscription', '/faq',
    '/mentions-legales', '/politique-de-confidentialite', '/rules', '/contact', '/reset-password'
  ];
  const isAsset = /\.(png|jpg|jpeg|svg|webp|ico|gif|css|js|woff2?|ttf|eot|otf|mp4|webm|json)$/i.test(req.nextUrl.pathname);

  if (
    publicPaths.includes(req.nextUrl.pathname) ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    isAsset
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

  // NOTE: On ne vérifie pas le rôle ici (voir ci-dessous)
  return NextResponse.next();
}
