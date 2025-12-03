# 🧪 TESTS DE SÉCURITÉ RAPIDES

**Guide pratique pour tester les correctifs de sécurité**

---

## 🎯 TESTS À EFFECTUER IMMÉDIATEMENT

### ✅ Test 1: Middleware - Protection Routes Web

#### Scénario A: Accès /admin sans token
```bash
# Action: Ouvrir navigateur en mode incognito
# URL: http://localhost:3000/admin

# ✅ RÉSULTAT ATTENDU:
# - Redirection automatique vers /connexion
# - Console log: "[AUTH] No token found, redirecting to login"
```

#### Scénario B: Accès /profil sans token
```bash
# Action: Ouvrir navigateur en mode incognito
# URL: http://localhost:3000/profil

# ✅ RÉSULTAT ATTENDU:
# - Redirection automatique vers /connexion
```

#### Scénario C: Accès /admin avec token USER
```bash
# Action: Se connecter comme USER, puis accéder à /admin
# URL: http://localhost:3000/admin

# ✅ RÉSULTAT ATTENDU:
# - Redirection vers /
# - Console log: "[AUTH] User is not admin, redirecting to home"
```

---

### ✅ Test 2: Middleware - Protection API Admin

#### Test avec cURL (Terminal)

```bash
# Test A: Sans token
curl -X GET http://localhost:3000/api/admin/service

# ✅ ATTENDU:
# {"error":"Unauthorized - Token required"}
# Status: 401

# Test B: Avec token expiré
curl -X GET http://localhost:3000/api/admin/service \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTAwMDAwMCwiaWF0IjoxMDAwMDB9.xxxxx"

# ✅ ATTENDU:
# {"error":"Unauthorized - Token expired"}
# Status: 401

# Test C: Avec token USER (non admin)
# Note: Remplacer <USER_TOKEN> par un vrai token USER
curl -X GET http://localhost:3000/api/admin/service \
  -H "Authorization: Bearer <USER_TOKEN>"

# ✅ ATTENDU:
# {"error":"Forbidden - Admin access required"}
# Status: 403

# Test D: Avec token ADMIN valide
# Note: Remplacer <ADMIN_TOKEN> par un vrai token ADMIN
curl -X GET http://localhost:3000/api/admin/service \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# ✅ ATTENDU:
# [{"id": 1, "name": "Service 1", ...}, ...]
# Status: 200
```

#### Test avec DevTools (Navigateur)

```javascript
// 1. Ouvrir DevTools (F12) > Console
// 2. Se connecter comme ADMIN
// 3. Copier/coller ce code dans la console:

const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

// Test sans token
fetch('/api/admin/service')
  .then(r => r.json())
  .then(console.log);
// ✅ ATTENDU: {error: "Unauthorized - Token required"}

// Test avec token valide
fetch('/api/admin/service', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(console.log);
// ✅ ATTENDU: [Array de services]
```

---

### ✅ Test 3: AdminGuard Component

#### Scénario A: Accès direct page admin
```bash
# 1. Ouvrir navigateur en mode incognito
# 2. URL: http://localhost:3000/admin/service
# 3. Observer le comportement

# ✅ RÉSULTAT ATTENDU:
# - Affichage loader (spinner) pendant 0.5s
# - Puis redirection vers /connexion
# - Console log: "[AdminGuard] Invalid or missing token"
```

#### Scénario B: Connexion USER puis accès admin
```bash
# 1. Se connecter comme USER
# 2. URL: http://localhost:3000/admin
# 3. Observer le comportement

# ✅ RÉSULTAT ATTENDU:
# - Affichage loader
# - Puis redirection vers /
# - Console log: "[AdminGuard] User is not admin"
```

#### Scénario C: Connexion ADMIN puis accès admin
```bash
# 1. Se connecter comme ADMIN
# 2. URL: http://localhost:3000/admin
# 3. Observer le comportement

# ✅ RÉSULTAT ATTENDU:
# - Affichage loader
# - Puis affichage page admin
# - Pas de redirection
```

---

### ✅ Test 4: Protection Page Paiement

#### Scénario A: Accès direct sans session_id
```bash
# Action: Accéder directement
# URL: http://localhost:3000/paiement/retour

# ✅ RÉSULTAT ATTENDU:
# - Redirection vers /
# - Console log: "[SECURITY] Direct access to payment return page blocked"
```

#### Scénario B: Accès avec session_id valide
```bash
# Action: Simuler retour Stripe
# URL: http://localhost:3000/paiement/retour?session_id=cs_test_xxxxx

# ✅ RÉSULTAT ATTENDU:
# - Page affichée
# - Vérification paiement en cours
# - État "processing" visible
```

---

## 🔥 TESTS D'INTRUSION (Sécurité Avancée)

### Test 1: Token Tampering (Modification Token)

```javascript
// DevTools Console
// Modifier le rôle dans le token

// 1. Décoder le token actuel
const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
const [header, payload, signature] = token.split('.');
const decoded = JSON.parse(atob(payload));
console.log('Original:', decoded);

// 2. Tenter de modifier le rôle (ne fonctionnera pas car signature invalide)
decoded.role = 'ADMIN';
const fakePayload = btoa(JSON.stringify(decoded));
const fakeToken = `${header}.${fakePayload}.${signature}`;

// 3. Tester avec le faux token
fetch('/api/admin/service', {
  headers: { 'Authorization': `Bearer ${fakeToken}` }
})
  .then(r => r.json())
  .then(console.log);

// ✅ ATTENDU: {error: "Unauthorized - Invalid token"}
// La signature ne correspond plus au payload modifié
```

### Test 2: SQL Injection (API)

```bash
# Tenter injection SQL dans paramètres
curl -X GET "http://localhost:3000/api/admin/devis?id=1' OR '1'='1" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# ✅ ATTENDU:
# - Pas d'injection possible
# - Requête gérée côté backend avec Prisma (safe)
```

### Test 3: XSS (Cross-Site Scripting)

```javascript
// Tenter d'injecter script malveillant dans formulaire
const maliciousInput = '<script>alert("XSS")</script>';

// Soumettre via formulaire de service
// ✅ ATTENDU:
// - React échappe automatiquement le HTML
// - Script ne s'exécute PAS
// - Texte affiché tel quel: <script>alert("XSS")</script>
```

---

## 📊 CHECKLIST COMPLÈTE

### Middleware
- [ ] ✅ Bloque accès /admin sans token
- [ ] ✅ Bloque accès /profil sans token
- [ ] ✅ Redirige USER tentant accès /admin
- [ ] ✅ Bloque API admin sans token (401)
- [ ] ✅ Bloque API admin token expiré (401)
- [ ] ✅ Bloque API admin USER (403)
- [ ] ✅ Autorise API admin ADMIN valide (200)
- [ ] ✅ Bloque accès direct /paiement/retour

### AdminGuard
- [ ] ✅ Redirige /connexion si pas de token
- [ ] ✅ Redirige / si token USER
- [ ] ✅ Affiche page si token ADMIN
- [ ] ✅ Loader visible pendant vérification

### Routes API (Tester 3 routes minimum)
- [ ] ✅ GET /api/admin/service protégé
- [ ] ✅ POST /api/admin/service protégé
- [ ] ✅ GET /api/admin/devis protégé
- [ ] ✅ Double vérification (middleware + handler)

### Tests d'Intrusion
- [ ] ✅ Token modifié rejeté
- [ ] ✅ SQL injection bloquée
- [ ] ✅ XSS échappé automatiquement

---

## 🛠️ OUTILS UTILES

### 1. Générer Token Test (JWT.io)

```
Site: https://jwt.io/

Payload à tester:
{
  "sub": 1,
  "email": "test@test.com",
  "role": "ADMIN",
  "exp": 9999999999,  // Date future
  "iat": 1701000000
}

Secret: Utiliser le JWT_SECRET de votre backend
```

### 2. Décoder Token Actuel (DevTools)

```javascript
// Console
const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
const payload = token.split('.')[1];
const decoded = JSON.parse(atob(payload));
console.log('Token Info:', decoded);
console.log('Expires:', new Date(decoded.exp * 1000));
console.log('Role:', decoded.role);
```

### 3. Tester Expiration Token

```javascript
// Console - Vérifier si token expiré
const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
const payload = JSON.parse(atob(token.split('.')[1]));
const now = Date.now();
const exp = payload.exp * 1000;
const isExpired = exp < now;

console.log('Token expires:', new Date(exp));
console.log('Now:', new Date(now));
console.log('Is expired:', isExpired);
```

---

## 🚨 RÉSOLUTION PROBLÈMES

### Problème: Redirection infinie

```
Symptôme: Page /admin redirige en boucle vers /connexion

Solution:
1. Vérifier que le cookie 'token' existe
   DevTools > Application > Cookies > localhost > token

2. Vérifier que le token n'est pas expiré
   Utiliser script "Décoder Token Actuel" ci-dessus

3. Vérifier que le rôle est bien "ADMIN"
   console.log(decoded.role) // Doit être "ADMIN"

4. Si token invalide, se reconnecter
```

### Problème: API retourne toujours 401

```
Symptôme: Même avec token admin, API retourne 401

Solution:
1. Vérifier format header Authorization
   Doit être: "Bearer <token>"
   PAS: "<token>" ou "bearer <token>"

2. Vérifier que le token est envoyé
   DevTools > Network > Requête > Headers
   Chercher: Authorization: Bearer eyJ...

3. Vérifier expiration token
   Voir script "Tester Expiration Token"
```

### Problème: Logs de sécurité invisibles

```
Symptôme: Pas de console.log dans terminal

Solution:
1. Les logs middleware sont côté SERVEUR, pas client
   Regarder le terminal où tourne `npm run dev`

2. Les logs AdminGuard sont côté CLIENT
   Regarder DevTools > Console du navigateur

3. Activer tous les logs
   Dans middleware.ts, vérifier que les console.log sont présents
```

---

## ✅ VALIDATION FINALE

### Si TOUS les tests passent:

```
✅ Sécurité authentification: OK
✅ Sécurité autorisation: OK
✅ Protection API admin: OK
✅ Protection pages admin: OK
✅ Middleware fonctionnel: OK
✅ AdminGuard fonctionnel: OK
✅ Double protection active: OK

🎉 SYSTÈME SÉCURISÉ - READY FOR PRODUCTION
```

---

**Document créé le**: 3 décembre 2025  
**Dernière mise à jour**: 3 décembre 2025  
**Version**: 1.0
