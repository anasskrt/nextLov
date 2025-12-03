# 🚨 FIXES DE SÉCURITÉ URGENTS - À Implémenter Maintenant

**Score actuel** : 6.5/10 ⚠️  
**Score cible** : 8.5/10 ✅  
**Temps estimé** : 2-3 heures

---

## 🔴 FIX #1 : Activer le Middleware d'Authentification (15 min)

### Fichier à Modifier : `middleware.ts`

**Problème** : Les vérifications d'auth sont commentées

**Solution** :

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const publicPaths = [
  '/',
  '/connexion',
  '/booking',
  '/inscription',
  '/faq',
  '/mentions-legales',
  '/CGU',
  '/rules',
  '/contact',
  '/reset-password',
  '/blog', // Ajouter le blog
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and blog posts
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check authentication
  const token = request.cookies.get('token')
  
  // ✅ ACTIVER LA VÉRIFICATION (décommenter)
  if (!token) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  // ✅ Vérifier l'expiration du token
  try {
    const decoded: any = jwtDecode(token.value);
    if (decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL('/connexion', request.url));
      response.cookies.delete('token');
      return response;
    }
  } catch (error) {
    const response = NextResponse.redirect(new URL('/connexion', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)'
  ]
}
```

---

## 🔴 FIX #2 : Sécuriser AdminGuard (10 min)

### Fichier à Modifier : `components/AdminGuard.tsx`

```typescript
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<null | boolean>(null)

  useEffect(() => {
    const token = Cookies.get('token');
    
    // ✅ ACTIVER LA VÉRIFICATION (décommenter)
    if (!token) {
      router.push('/connexion')
      return
    }

    // Vérifier le rôle côté serveur
    fetch("/api/auth/whoIAm", {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.text();
      })
      .then(role => {
        if (parseInt(role, 10) !== 1) {
          router.push('/')
        } else {
          setAllowed(true)
        }
      })
      .catch(() => {
        Cookies.remove('token');
        router.push('/connexion');
      });
  }, [router])

  // ✅ Ne rien afficher pendant la vérification
  if (allowed === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    )
  }

  // ✅ Ne rien afficher si non autorisé
  if (!allowed) {
    return null
  }

  return <>{children}</>
}
```

---

## 🔴 FIX #3 : Créer Utilitaires d'Authentification (20 min)

### Nouveau Fichier : `lib/auth.ts`

```typescript
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

export interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Vérifie qu'un token est valide et appartient à un admin
 */
export function verifyAdminToken(authHeader: string | null): DecodedToken {
  if (!authHeader) {
    throw new Error('No authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = jwtDecode<DecodedToken>(token);
  
  // Vérifier expiration
  if (decoded.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }
  
  // Vérifier rôle admin
  if (decoded.role !== 'ADMIN') {
    throw new Error('Not an admin');
  }
  
  return decoded;
}

/**
 * Vérifie qu'un token est valide (n'importe quel utilisateur)
 */
export function verifyUserToken(authHeader: string | null): DecodedToken {
  if (!authHeader) {
    throw new Error('No authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = jwtDecode<DecodedToken>(token);
  
  // Vérifier expiration
  if (decoded.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }
  
  return decoded;
}

/**
 * Middleware helper pour protéger une route admin
 */
export function requireAdmin(handler: (req: NextRequest, user: DecodedToken) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      const user = verifyAdminToken(authHeader);
      return await handler(req, user);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware helper pour protéger une route utilisateur
 */
export function requireAuth(handler: (req: NextRequest, user: DecodedToken) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      const user = verifyUserToken(authHeader);
      return await handler(req, user);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}
```

---

## 🔴 FIX #4 : Protéger les Routes Admin API (30 min)

### Exemple : `app/api/admin/user/route.ts`

**Avant** :
```typescript
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const backendRes = await fetch(`${process.env.BACKEND_URL}/user`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
```

**Après** :
```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const GET = requireAdmin(async (req, user) => {
  // ✅ user est garanti d'être un admin valide
  const backendRes = await fetch(`${process.env.BACKEND_URL}/user`, {
    headers: {
      Authorization: req.headers.get("authorization")!,
    },
  });
  
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
});
```

### À Appliquer Sur Tous Ces Fichiers :

- ✅ `app/api/admin/user/route.ts`
- ✅ `app/api/admin/service/route.ts`
- ✅ `app/api/admin/service/[id]/route.ts`
- ✅ `app/api/admin/transports/route.ts`
- ✅ `app/api/admin/transports/[id]/route.ts`
- ✅ `app/api/admin/devis/route.ts`
- ✅ `app/api/admin/devis/[devisId]/route.ts`
- ✅ `app/api/admin/devis/calendar/route.ts`

---

## 🟡 FIX #5 : Ajouter Validation des Entrées (45 min)

### Installer Zod

```bash
npm install zod
```

### Exemple : `components/PaymentForm.tsx`

```typescript
import { z } from 'zod';

// ✅ Schéma de validation
const PaymentDataSchema = z.object({
  totalAmount: z.number().min(1).max(10000),
  services: z.array(z.object({
    id: z.string().optional(),
    name: z.string().max(200),
    description: z.string().max(500).optional(),
    price: z.number().min(0).max(1000),
    quantity: z.number().int().min(1).max(10).default(1),
  })),
  userInfo: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[0-9]{10}$/),
    selectedTransport: z.object({
      type: z.string(),
      prix: z.number().min(0),
    }).optional(),
  }),
  bookingDetails: z.object({
    fullDepartureDate: z.string().datetime(),
    fullReturnDate: z.string().datetime(),
    flightNumber: z.string().max(20).optional(),
  }),
});

const handlePayment = async () => {
  setIsProcessing(true);

  // ✅ Valider les données
  try {
    const validatedData = PaymentDataSchema.parse({
      totalAmount,
      services,
      userInfo,
      bookingDetails,
    });
    
    // Utiliser validatedData au lieu des props
    const lineItems = [];
    lineItems.push({
      name: "Gardiennage automobile",
      amount: validatedData.totalAmount,
      quantity: 1,
    });
    
    // ... reste du code
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      alert('Données invalides. Veuillez vérifier le formulaire.');
      setIsProcessing(false);
      return;
    }
  }
};
```

---

## 🟡 FIX #6 : Sécuriser le SessionStorage (15 min)

### Fichier : `components/BookingForm.tsx`

**Avant** :
```typescript
sessionStorage.setItem("bookingDetails", JSON.stringify({
  userInfo: {
    name: name,
    email: email,
    phone: phone,
    // ... données sensibles
  },
}));
```

**Après** :
```typescript
// ✅ Ne stocker QUE le minimum
sessionStorage.setItem("bookingDetails", JSON.stringify({
  // Stocker uniquement les identifiants et dates
  quoteId: quoteId,
  departureDate: departureDate,
  returnDate: returnDate,
  transportId: selectedTransport?.id,
  serviceIds: services.map(s => s.id),
  // ❌ NE PAS stocker : email, téléphone, nom
}));

// Les données perso seront récupérées depuis le backend
// lors de la page de paiement avec le quoteId
```

---

## 🟡 FIX #7 : Ajouter Headers de Sécurité (10 min)

### Fichier : `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 🟢 FIX #8 : Ajouter Rate Limiting (20 min)

### Nouveau Fichier : `lib/rate-limit.ts`

```typescript
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute par défaut
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = identifier;
  
  // Nettoyer les anciennes entrées
  if (store[key] && store[key].resetAt < now) {
    delete store[key];
  }
  
  // Initialiser si n'existe pas
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetAt: now + windowMs,
    };
  }
  
  // Incrémenter
  store[key].count++;
  
  const allowed = store[key].count <= limit;
  const remaining = Math.max(0, limit - store[key].count);
  
  return { allowed, remaining };
}
```

### Utilisation dans `app/api/auth/connexion/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // ✅ Rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const { allowed, remaining } = checkRateLimit(`auth:${ip}`, 5, 300000); // 5 tentatives / 5 min
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives de connexion. Réessayez dans 5 minutes.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
          'Retry-After': '300',
        }
      }
    );
  }

  const body = await req.json();
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/connexion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  
  // Ajouter headers de rate limit
  const response = NextResponse.json(data, { status: backendRes.status });
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  
  return response;
}
```

---

## 📋 Checklist d'Implémentation

### Phase 1 : Urgent (Aujourd'hui - 1h15)
- [ ] ✅ Fix #1 : Activer middleware (15 min)
- [ ] ✅ Fix #2 : Sécuriser AdminGuard (10 min)
- [ ] ✅ Fix #3 : Créer lib/auth.ts (20 min)
- [ ] ✅ Fix #4 : Protéger routes admin (30 min)

### Phase 2 : Important (Cette Semaine - 1h30)
- [ ] ✅ Fix #5 : Validation Zod (45 min)
- [ ] ✅ Fix #6 : Sécuriser sessionStorage (15 min)
- [ ] ✅ Fix #7 : Headers sécurité (10 min)
- [ ] ✅ Fix #8 : Rate limiting (20 min)

---

## 🧪 Tests à Effectuer Après Implémentation

### Test 1 : Authentification
```bash
# Sans token, essayer d'accéder à /profil
# Devrait rediriger vers /connexion
curl http://localhost:3001/profil
```

### Test 2 : Admin
```bash
# Sans rôle admin, essayer /admin
# Devrait rediriger vers /
```

### Test 3 : API Admin
```bash
# Sans token admin
curl http://localhost:3001/api/admin/user
# Devrait retourner 401
```

### Test 4 : Rate Limiting
```bash
# 6 tentatives de connexion rapides
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/connexion \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# La 6ème devrait retourner 429
```

---

## 📊 Résultats Attendus

**Avant** :
- Score : 6.5/10 ⚠️
- Middleware désactivé
- Pas de protection admin
- Pas de validation
- Pas de rate limiting

**Après** :
- Score : 8.5/10 ✅
- Middleware actif
- Admin protégé
- Validation Zod
- Rate limiting actif
- Headers sécurité

---

## 🚀 Ordre d'Implémentation Recommandé

1. **Fix #3** d'abord (lib/auth.ts) → Fondation
2. **Fix #1** (middleware) → Protection globale
3. **Fix #2** (AdminGuard) → Protection admin UI
4. **Fix #4** (routes API) → Protection admin API
5. **Fix #7** (headers) → Protection globale
6. **Fix #8** (rate limiting) → Anti-abus
7. **Fix #5** (validation) → Qualité données
8. **Fix #6** (sessionStorage) → Privacy

---

**⏱️ Temps total : ~2h45 pour une sécurité 8.5/10**

*Dernière mise à jour : 3 décembre 2025*
