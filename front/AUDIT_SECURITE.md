# 🔐 Audit de Sécurité - Frontend MSParking

**Date** : 3 décembre 2025  
**Auditeur** : GitHub Copilot  
**Score Global** : **6.5/10** ⚠️

---

## 📊 Vue d'Ensemble

| Catégorie | Score | Priorité |
|-----------|-------|----------|
| **Authentification** | 5/10 | 🔴 CRITIQUE |
| **Authorization** | 4/10 | 🔴 CRITIQUE |
| **API Security** | 6/10 | 🟡 IMPORTANT |
| **Data Protection** | 7/10 | 🟡 IMPORTANT |
| **XSS Protection** | 8/10 | 🟢 BON |
| **CSRF Protection** | 3/10 | 🔴 CRITIQUE |
| **Environment Variables** | 7/10 | 🟡 IMPORTANT |
| **Input Validation** | 5/10 | 🟡 IMPORTANT |

---

## 🔴 VULNÉRABILITÉS CRITIQUES

### 1. ⚠️ Middleware d'Authentification Désactivé

**Fichier** : `middleware.ts` (ligne 25-27)

```typescript
// ❌ PROBLÈME : Auth commentée !
const token = request.cookies.get('token')
// if (!token) {
//   return NextResponse.redirect(new URL('/connexion', request.url))
// }
```

**Impact** :
- ❌ **N'importe qui peut accéder aux pages protégées**
- ❌ Routes admin accessibles sans authentification
- ❌ Profil utilisateur accessible sans login

**Exploitation** :
```bash
# Sans être connecté, accéder directement à :
https://msparking.fr/profil
https://msparking.fr/admin
```

**🔧 FIX URGENT** :
```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.includes(pathname) || pathname.startsWith('/blog')) {
    return NextResponse.next()
  }

  // Check authentication
  const token = request.cookies.get('token')
  
  // ✅ ACTIVER LA VÉRIFICATION
  if (!token) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  // Vérifier l'expiration du token
  try {
    const decoded = jwtDecode(token.value);
    if (decoded.exp * 1000 < Date.now()) {
      // Token expiré
      const response = NextResponse.redirect(new URL('/connexion', request.url));
      response.cookies.delete('token');
      return response;
    }
  } catch (error) {
    // Token invalide
    const response = NextResponse.redirect(new URL('/connexion', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next()
}
```

---

### 2. ⚠️ AdminGuard Insuffisant

**Fichier** : `components/AdminGuard.tsx` (ligne 13-16)

```typescript
// ❌ PROBLÈME : Vérification aussi commentée !
const token = Cookies.get('token');
// if (!token) {
//   router.push('/connexion')
//   return
// }
```

**Impact** :
- ❌ Pages admin accessibles sans token
- ❌ Vérification du rôle uniquement côté client
- ❌ Facilement bypassable avec DevTools

**Exploitation** :
```javascript
// Dans la console Chrome :
// 1. Désactiver JavaScript
// 2. Ou modifier le code client
// 3. Accès admin garanti !
```

**🔧 FIX** :
```typescript
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<null | boolean>(null)

  useEffect(() => {
    const token = Cookies.get('token');
    
    // ✅ VÉRIFIER LE TOKEN
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

  // ✅ NE RIEN AFFICHER tant que non vérifié
  if (allowed === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    )
  }

  if (!allowed) {
    return null
  }

  return <>{children}</>
}
```

---

### 3. ⚠️ Pas de Protection CSRF

**Problème** : Aucun token CSRF sur les formulaires critiques

**Impact** :
- ❌ Attaquant peut forcer des actions (paiement, modification profil)
- ❌ Vulnérable aux attaques cross-site

**Exploitation** :
```html
<!-- Site malveillant evil.com -->
<form action="https://msparking.fr/api/stripe/init" method="POST">
  <input name="amount" value="1000000" />
  <input name="userId" value="victim-id" />
</form>
<script>document.forms[0].submit();</script>
```

**🔧 FIX** :
```typescript
// middleware.ts
import { randomBytes } from 'crypto';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Générer token CSRF pour les requêtes GET
  if (request.method === 'GET') {
    const csrfToken = randomBytes(32).toString('hex');
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: false, // Accessible en JS
      secure: true,
      sameSite: 'strict',
    });
  }
  
  // Vérifier token CSRF pour les requêtes POST/PUT/DELETE
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const csrfCookie = request.cookies.get('csrf-token');
    const csrfHeader = request.headers.get('x-csrf-token');
    
    if (!csrfCookie || !csrfHeader || csrfCookie.value !== csrfHeader) {
      return NextResponse.json(
        { error: 'CSRF token mismatch' },
        { status: 403 }
      );
    }
  }
  
  return response;
}
```

---

### 4. ⚠️ Routes API Sans Protection

**Fichiers** : Tous les fichiers dans `/app/api/admin/*`

**Exemple** : `app/api/admin/user/route.ts`

```typescript
// ❌ PROBLÈME : Pas de vérification du rôle admin !
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  // Passe directement le header au backend
  // Aucune vérification côté frontend !
  const backendRes = await fetch(`${process.env.BACKEND_URL}/user`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });
  return NextResponse.json(data, { status: backendRes.status });
}
```

**Impact** :
- ⚠️ Si backend ne vérifie pas non plus → accès admin ouvert
- ⚠️ Pas de défense en profondeur

**🔧 FIX** :
```typescript
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // ✅ Vérifier le token et le rôle AVANT de proxifier
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await verifyAdminToken(authHeader);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // ✅ Maintenant on peut proxifier
  const backendRes = await fetch(`${process.env.BACKEND_URL}/user`, {
    headers: { Authorization: authHeader },
  });
  
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
```

**Créer** : `/lib/auth.ts`
```typescript
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  exp: number;
}

export async function verifyAdminToken(authHeader: string): Promise<DecodedToken> {
  const token = authHeader.replace('Bearer ', '');
  
  const decoded = jwtDecode<DecodedToken>(token);
  
  // Vérifier expiration
  if (decoded.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }
  
  // Vérifier rôle
  if (decoded.role !== 'ADMIN') {
    throw new Error('Not an admin');
  }
  
  return decoded;
}

export async function verifyUserToken(authHeader: string): Promise<DecodedToken> {
  const token = authHeader.replace('Bearer ', '');
  const decoded = jwtDecode<DecodedToken>(token);
  
  if (decoded.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }
  
  return decoded;
}
```

---

## 🟡 PROBLÈMES IMPORTANTS

### 5. ⚠️ Tokens JWT Décodés Côté Client

**Fichier** : `hooks/useAuth.ts`

```typescript
// ⚠️ PROBLÈME : Décoder le JWT côté client expose des infos
const decoded: DecodedToken = jwtDecode(token);
```

**Impact** :
- ⚠️ Données utilisateur exposées dans le navigateur
- ⚠️ Facile de voir l'ID user, email, rôle
- ⚠️ Peut faciliter des attaques ciblées

**Recommandation** :
- ✅ OK pour lire le rôle (affichage UI)
- ❌ NE JAMAIS se fier à ces données pour la sécurité
- ✅ Toujours re-vérifier côté serveur

**Amélioration** :
```typescript
// useAuth.ts - OK pour l'UI
// Mais ajouter un commentaire :

export function useAuth() {
  // ⚠️ ATTENTION : Ces données sont pour l'UI uniquement
  // Ne JAMAIS se fier à ces valeurs pour des décisions de sécurité
  // Toujours vérifier côté serveur
  
  const [user, setUser] = useState<DecodedToken | null>(null);
  // ... reste du code
}
```

---

### 6. ⚠️ Validation des Entrées Manquante

**Fichier** : `components/PaymentForm.tsx`

```typescript
// ❌ PROBLÈME : Données utilisateur non validées avant envoi
const handlePayment = async () => {
  // Pas de validation !
  const lineItems = [];
  lineItems.push({
    name: "Parking",
    amount: totalAmount, // ⚠️ Peut être négatif ?
    quantity: 1,
  });
}
```

**Impact** :
- ⚠️ Montants négatifs possibles ?
- ⚠️ Quantités invalides ?
- ⚠️ Injection de données malveillantes ?

**🔧 FIX** :
```typescript
import { z } from 'zod';

const PaymentSchema = z.object({
  amount: z.number().min(0.01).max(10000),
  services: z.array(z.object({
    id: z.string(),
    name: z.string().max(200),
    price: z.number().min(0).max(1000),
  })),
  userInfo: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[0-9]{10}$/),
  }),
});

const handlePayment = async () => {
  // ✅ Valider les données
  try {
    const validated = PaymentSchema.parse({
      amount: totalAmount,
      services,
      userInfo,
    });
  } catch (error) {
    console.error('Validation error:', error);
    alert('Données invalides');
    return;
  }
  
  // ✅ Continuer avec les données validées
  // ...
}
```

---

### 7. ⚠️ Stockage de Données Sensibles

**Fichier** : `components/BookingForm.tsx`

```typescript
// ⚠️ PROBLÈME : Données dans sessionStorage sans chiffrement
sessionStorage.setItem("bookingDetails", JSON.stringify({
  userInfo: {
    email: "user@example.com",  // Email en clair !
    phone: "0612345678",        // Téléphone en clair !
  },
  // ...
}));
```

**Impact** :
- ⚠️ Données accessibles via DevTools
- ⚠️ Peuvent être volées par XSS
- ⚠️ Persistent même après fermeture onglet

**🔧 FIX** :
```typescript
// Option 1 : Ne stocker QUE le minimum
sessionStorage.setItem("bookingDetails", JSON.stringify({
  // Stocker uniquement les IDs, pas les données perso
  quoteId: "abc123",
  departureDate: "2025-12-10",
  returnDate: "2025-12-17",
  // ❌ Pas d'email, pas de téléphone
}));

// Option 2 : Chiffrer (si vraiment nécessaire)
import CryptoJS from 'crypto-js';

const SECRET = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

function encryptData(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
}

function decryptData(encrypted: string): any {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Utilisation
const encrypted = encryptData(bookingDetails);
sessionStorage.setItem("bookingDetails", encrypted);

// Lecture
const encrypted = sessionStorage.getItem("bookingDetails");
const data = decryptData(encrypted);
```

---

### 8. ⚠️ Variables d'Environnement Exposées

**Problème** : Variables `NEXT_PUBLIC_*` accessibles côté client

```typescript
// ⚠️ Ces variables sont PUBLIQUES
process.env.NEXT_PUBLIC_STRIPE_KEY  // OK
process.env.NEXT_PUBLIC_API_URL     // OK si pas sensible
```

**🔧 Vérifier** :
```bash
# Lister toutes les variables NEXT_PUBLIC
grep -r "NEXT_PUBLIC_" .

# ✅ OK pour :
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# - NEXT_PUBLIC_API_URL

# ❌ JAMAIS exposer :
# - Clés API privées
# - Secrets
# - Credentials DB
```

---

## 🟢 POINTS FORTS

### ✅ 1. Protection XSS (React)

React échappe automatiquement les données :
```tsx
<div>{userInput}</div> // ✅ Échappé automatiquement
```

Utilisation correcte de `dangerouslySetInnerHTML` uniquement pour JSON-LD :
```tsx
// ✅ OK : JSON structuré, pas d'input utilisateur
<script type="application/ld+json" 
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
/>
```

---

### ✅ 2. Cookies HTTPOnly (Backend)

Les tokens sont stockés en cookies HTTPOnly (configuré backend) :
```typescript
// ✅ Bon : Le token n'est PAS accessible via JavaScript
const token = Cookies.get('token'); // Lit depuis le cookie HTTP
```

**Mais** : Vérifier côté backend que le cookie a bien :
```typescript
// Backend (NestJS)
res.cookie('token', jwt, {
  httpOnly: true,  // ✅ Pas accessible en JS
  secure: true,    // ✅ HTTPS uniquement
  sameSite: 'strict', // ✅ Protection CSRF
  maxAge: 3600000, // 1 heure
});
```

---

### ✅ 3. Séparation Frontend/Backend

Toutes les routes API proxifient vers le backend :
```typescript
// ✅ Bon : Logique métier côté backend
export async function POST(req: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/stripe/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return NextResponse.json(data);
}
```

---

## 📋 CHECKLIST DE SÉCURITÉ

### 🔴 URGENT (À Faire Maintenant)

- [ ] **Activer le middleware d'authentification** (middleware.ts ligne 25)
- [ ] **Activer la vérification token dans AdminGuard** (AdminGuard.tsx ligne 13)
- [ ] **Ajouter vérification admin dans toutes les routes `/api/admin/*`**
- [ ] **Implémenter protection CSRF**
- [ ] **Vérifier expiration du token dans middleware**

### 🟡 IMPORTANT (Cette Semaine)

- [ ] Ajouter validation avec Zod sur tous les formulaires
- [ ] Ne pas stocker données sensibles en sessionStorage
- [ ] Créer `/lib/auth.ts` avec fonctions de vérification
- [ ] Ajouter rate limiting (trop de requêtes)
- [ ] Logger les tentatives d'accès non autorisées

### 🟢 AMÉLIORATIONS (Ce Mois)

- [ ] Audit complet des variables d'environnement
- [ ] Implémenter Content Security Policy (CSP)
- [ ] Ajouter headers de sécurité (next.config.ts)
- [ ] Tests de pénétration
- [ ] Monitoring des erreurs d'auth

---

## 🛡️ Recommandations Générales

### 1. Headers de Sécurité

**Fichier** : `next.config.ts`

```typescript
const nextConfig = {
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
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.stripe.com",
              "frame-src js.stripe.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

---

### 2. Rate Limiting

```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(ip: string, limit: number = 10): boolean {
  const count = (rateLimit.get(ip) as number) || 0;
  
  if (count >= limit) {
    return false; // Rate limit exceeded
  }
  
  rateLimit.set(ip, count + 1);
  return true;
}

// Utilisation dans une route API
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  if (!checkRateLimit(ip, 10)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // ... reste du code
}
```

---

### 3. Logging de Sécurité

```typescript
// lib/security-logger.ts
export function logSecurityEvent(event: {
  type: 'AUTH_FAILURE' | 'UNAUTHORIZED_ACCESS' | 'SUSPICIOUS_ACTIVITY';
  ip: string;
  url: string;
  userId?: string;
  details?: any;
}) {
  console.error('[SECURITY]', {
    timestamp: new Date().toISOString(),
    ...event,
  });
  
  // En production : envoyer à un service de monitoring
  // (Sentry, Datadog, etc.)
}

// Utilisation
if (!token) {
  logSecurityEvent({
    type: 'AUTH_FAILURE',
    ip: req.headers.get('x-forwarded-for') || 'unknown',
    url: req.url,
  });
  return NextResponse.redirect(new URL('/connexion', request.url));
}
```

---

## 🎯 Score Détaillé par Catégorie

### 🔴 Authentification (5/10)

| Aspect | Score | Commentaire |
|--------|-------|-------------|
| Token Storage | 8/10 | ✅ HTTPOnly cookies (si backend OK) |
| Token Verification | 2/10 | ❌ Middleware désactivé |
| Token Expiration | 7/10 | ✅ Vérifié dans useAuth |
| Logout | 6/10 | ⚠️ Pas vu de route logout |

### 🔴 Authorization (4/10)

| Aspect | Score | Commentaire |
|--------|-------|-------------|
| Role Verification | 3/10 | ❌ AdminGuard bypassable |
| API Protection | 4/10 | ❌ Routes admin non protégées |
| Route Guards | 2/10 | ❌ Middleware désactivé |

### 🟡 API Security (6/10)

| Aspect | Score | Commentaire |
|--------|-------|-------------|
| CSRF Protection | 0/10 | ❌ Aucune protection |
| Rate Limiting | 0/10 | ❌ Pas implémenté |
| Input Validation | 5/10 | ⚠️ Partiel |
| Error Handling | 8/10 | ✅ Correct |

### 🟡 Data Protection (7/10)

| Aspect | Score | Commentaire |
|--------|-------|-------------|
| Sensitive Data | 5/10 | ⚠️ sessionStorage non chiffré |
| XSS Protection | 9/10 | ✅ React auto-escape |
| SQL Injection | 10/10 | ✅ ORM backend (Prisma) |

---

## 📞 Prochaines Étapes

### Priorité 1 (Aujourd'hui)
1. ✅ Activer middleware auth
2. ✅ Activer AdminGuard
3. ✅ Protéger routes `/api/admin/*`

### Priorité 2 (Cette Semaine)
4. ✅ Implémenter CSRF
5. ✅ Ajouter validation Zod
6. ✅ Créer `/lib/auth.ts`

### Priorité 3 (Ce Mois)
7. ✅ Rate limiting
8. ✅ Security headers
9. ✅ Logging sécurité
10. ✅ Tests de pénétration

---

**🎯 Objectif : Atteindre 8.5/10 après implémentation des fixes**

*Dernière mise à jour : 3 décembre 2025*
