# ⚡ GUIDE RAPIDE - SÉCURITÉ FRONTEND

**Pour l'équipe de développement - Lecture 2 minutes**

---

## 🎯 QU'EST-CE QUI A CHANGÉ ?

### ✅ MAINTENANT ACTIF

```
✅ Middleware vérifie TOUS les tokens
✅ Toutes les routes /admin sont protégées  
✅ Toutes les routes /api/admin sont protégées
✅ AdminGuard vérifie le rôle avant affichage
✅ Page paiement bloque accès direct
```

---

## 🚀 CE QUE VOUS DEVEZ SAVOIR

### 1. Routes API Admin - TOUJOURS Envoyer le Token

```typescript
// ❌ AVANT (ne fonctionne PLUS)
fetch('/api/admin/service')

// ✅ MAINTENANT (obligatoire)
const token = Cookies.get('token');
fetch('/api/admin/service', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 2. Nouvelle Librairie - `lib/auth.ts`

```typescript
import { verifyAdminToken, isTokenValid, decodeToken } from '@/lib/auth';

// Vérifier si token valide
if (!isTokenValid(token)) {
  // Token expiré ou invalide
}

// Vérifier si utilisateur admin
const user = verifyAdminToken(authHeader);
if (!user) {
  // Pas autorisé
}

// Décoder token
const decoded = decodeToken(token);
console.log(decoded.email, decoded.role);
```

### 3. Créer Nouvelle Route API Admin

```typescript
// app/api/admin/ma-route/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // ✅ TOUJOURS commencer par cette vérification
  const authHeader = req.headers.get("authorization");
  const user = verifyAdminToken(authHeader || '');
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  // ✅ Votre code ici
  // ...
}
```

---

## 🧪 TESTS RAPIDES (1 min)

### Test 1: API Sans Token
```bash
curl http://localhost:3000/api/admin/service
# ✅ Attendu: {"error":"Unauthorized - Token required"}
```

### Test 2: Accès Admin Sans Connexion
```
1. Ouvrir mode incognito
2. Aller sur http://localhost:3000/admin
3. ✅ Attendu: Redirection vers /connexion
```

### Test 3: Page Admin avec Compte USER
```
1. Se connecter comme USER
2. Aller sur http://localhost:3000/admin
3. ✅ Attendu: Redirection vers /
```

---

## ⚠️ PROBLÈMES COURANTS

### "Je suis redirigé en boucle vers /connexion"

**Cause**: Token expiré ou invalide

**Solution**:
```javascript
// DevTools Console
const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
console.log('Role:', payload.role);

// Si expiré ou rôle incorrect → Se reconnecter
```

### "Mon API retourne toujours 401"

**Cause**: Token non envoyé ou mal formaté

**Solution**:
```typescript
// ✅ Format correct
headers: {
  'Authorization': `Bearer ${token}`  // Avec espace après Bearer
}

// ❌ Format incorrect
headers: {
  'Authorization': token  // Manque "Bearer "
}
```

### "AdminGuard ne protège pas ma page"

**Cause**: AdminGuard non ajouté dans la page

**Solution**:
```tsx
// Dans votre page admin
import AdminGuard from "@/components/AdminGuard";

export default function MaPageAdmin() {
  return (
    <AdminGuard>
      {/* Votre contenu */}
    </AdminGuard>
  );
}
```

---

## 📁 FICHIERS IMPORTANTS

```
/middleware.ts                    ← Protège routes web + API
/lib/auth.ts                      ← Utilitaires auth (NOUVEAU)
/components/AdminGuard.tsx        ← Protège pages admin
/app/api/admin/**/route.ts        ← Routes API protégées (9 fichiers)
```

---

## 🔍 LOGS UTILES

### Logs Middleware (Terminal Serveur)
```bash
[API SECURITY] Admin API access granted for admin@test.com
[AUTH] Token expired, redirecting to login
[SECURITY] Direct access to payment page blocked
```

### Logs Client (DevTools Console)
```bash
[AdminGuard] Invalid or missing token
[AdminGuard] User is not admin
```

---

## 📚 DOCUMENTATION COMPLÈTE

| Fichier | Usage |
|---------|-------|
| `SECURITE_COMPLETE.md` | Détails techniques complets |
| `TESTS_SECURITE_RAPIDES.md` | Guide de tests |
| `RECAPITULATIF_FINAL.md` | Vue d'ensemble |
| `GUIDE_RAPIDE.md` | Ce fichier (Quick start) |

---

## 🆘 BESOIN D'AIDE ?

1. **Lire les logs** (terminal + console navigateur)
2. **Consulter** `TESTS_SECURITE_RAPIDES.md` section "Résolution Problèmes"
3. **Vérifier token** avec scripts fournis dans doc
4. **Contacter** l'équipe sécurité

---

## ✅ CHECKLIST DÉVELOPPEUR

Avant de committer du code admin:

- [ ] ✅ Route API admin commence par `verifyAdminToken()`
- [ ] ✅ Token envoyé dans header `Authorization: Bearer ${token}`
- [ ] ✅ Page admin wrappe avec `<AdminGuard>`
- [ ] ✅ Erreurs gérées (401, 403)
- [ ] ✅ Testé avec compte USER (doit être bloqué)
- [ ] ✅ Testé avec compte ADMIN (doit fonctionner)

---

**🎉 C'est tout ! Bon développement sécurisé !**

*Dernière mise à jour: 3 décembre 2025*
