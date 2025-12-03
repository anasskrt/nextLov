# 🧪 Guide de Tests - Système de Paiement

## 🎯 Objectif

Ce guide vous permet de tester complètement le nouveau système de paiement avec retry logic.

---

## 📋 Prérequis

- [ ] Backend démarré (`npm run start:dev`)
- [ ] Frontend démarré (`npm run dev`)
- [ ] Stripe CLI installé
- [ ] Variables d'environnement configurées

---

## 🔧 Configuration Stripe CLI

### Installation

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Autres OS
https://stripe.com/docs/stripe-cli#install
```

### Connexion

```bash
stripe login
# Suivre les instructions dans le navigateur
```

### Écouter les Webhooks en Local

```bash
# Terminal dédié
stripe listen --forward-to http://localhost:3000/webhooks/stripe

# Copier le webhook secret affiché (whsec_...)
# L'ajouter dans le .env backend : STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## ✅ Test 1 : Paiement Réussi (Webhook Rapide)

### Objectif
Vérifier que le paiement fonctionne quand le webhook arrive rapidement.

### Étapes

1. **Démarrer le paiement**
   ```
   - Aller sur http://localhost:3001
   - Remplir le formulaire de devis
   - Cliquer sur "Procéder au paiement"
   ```

2. **Compléter le paiement**
   ```
   - Numéro de carte : 4242 4242 4242 4242
   - Date : 12/34
   - CVC : 123
   - Cliquer sur "Payer"
   ```

3. **Observer la page de retour**
   ```
   - Devrait afficher : "Vérification de votre paiement..." (< 1s)
   - Puis : "Traitement du paiement en cours... (1/10)" (1-3s)
   - Enfin : "Paiement validé ! 🎉" (après 2-5s)
   ```

### Résultat Attendu

- ✅ Redirection vers `/paiement/retour?session_id=cs_test_...`
- ✅ État "processing" visible avec compteur
- ✅ Succès affiché après 2-5 secondes
- ✅ Boutons "Voir ma réservation" et "Retour à l'accueil"

### Vérifications Backend

```bash
# Logs Stripe CLI
stripe listen
# Devrait voir : checkout.session.completed

# Base de données
SELECT * FROM "PaymentSession" ORDER BY "createdAt" DESC LIMIT 1;
# status devrait être 'PAID'

# Réservation créée
SELECT * FROM "Booking" ORDER BY "createdAt" DESC LIMIT 1;
# Devrait exister avec bookingId lié à PaymentSession
```

---

## ⏰ Test 2 : Webhook Lent (Simulation)

### Objectif
Vérifier que le retry fonctionne quand le webhook prend du temps.

### Simulation du Délai

**Option A : Ajouter un délai dans le webhook handler**

```typescript
// Backend: stripe-webhook.controller.ts
private async handleCheckoutCompleted(session: any) {
  // 🧪 TEST : Simuler un délai de 10 secondes
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // ... reste du code
}
```

**Option B : Arrêter temporairement Stripe CLI**

```bash
# Arrêter stripe listen pendant 10 secondes
# Puis relancer
stripe listen --forward-to http://localhost:3000/webhooks/stripe
```

### Étapes

1. Effectuer un paiement (comme Test 1)
2. Observer les retries :
   ```
   (1/10) - 2 secondes
   (2/10) - 4 secondes
   (3/10) - 6 secondes
   (4/10) - 8 secondes
   (5/10) - 10 secondes
   → Succès après arrivée du webhook
   ```

### Résultat Attendu

- ✅ Compteur visible qui augmente
- ✅ Message "Traitement en cours..."
- ✅ Icône horloge qui pulse
- ✅ Succès final après arrivée du webhook

---

## ❌ Test 3 : Paiement Échoué

### Objectif
Vérifier la gestion des erreurs de paiement.

### Cartes de Test

```
# Carte refusée (insufficient funds)
4000 0000 0000 9995

# Carte refusée (generic decline)
4000 0000 0000 0002

# Carte expirée
4000 0000 0000 0069
```

### Étapes

1. Utiliser une carte de test refusée
2. Observer le message d'erreur Stripe
3. Après refus, revenir au formulaire

### Résultat Attendu

- ✅ Message d'erreur Stripe clair
- ✅ Possibilité de réessayer
- ❌ Pas de redirection vers `/paiement/retour`
- ❌ Pas de réservation créée

---

## 🕐 Test 4 : Timeout (20 secondes)

### Objectif
Vérifier le comportement après 10 tentatives sans succès.

### Simulation

Arrêter complètement le webhook :

```bash
# Arrêter stripe listen
# OU bloquer le port du backend temporairement
```

### Étapes

1. Effectuer un paiement
2. Attendre 20 secondes (10 × 2s)
3. Observer le fallback

### Résultat Attendu

- ✅ Compteur monte jusqu'à (10/10)
- ✅ Après 20s : Affichage du succès quand même
- ✅ Message : "Vous recevrez un email sous peu"
- ✅ L'utilisateur n'est pas bloqué

### Vérification Ultérieure

```bash
# Redémarrer le webhook
stripe listen --forward-to http://localhost:3000/webhooks/stripe

# Le webhook finira par être traité par Stripe (retry automatique)
# Vérifier que la réservation est créée même si l'user a quitté
```

---

## 🔄 Test 5 : Idempotence (Webhook Multiple)

### Objectif
Vérifier qu'un webhook reçu plusieurs fois ne crée pas de doublon.

### Simulation

```bash
# Stripe CLI : Rejouer un webhook
stripe trigger checkout.session.completed
# Attendre 2 secondes
stripe trigger checkout.session.completed
# (même session_id)
```

### Résultat Attendu

- ✅ Une seule réservation créée
- ✅ Logs : "Booking already exists"
- ❌ Pas de doublon en base

### Vérification

```sql
-- Compter les réservations pour une session
SELECT COUNT(*) FROM "Booking" b
JOIN "PaymentSession" ps ON ps."bookingId" = b.id
WHERE ps."sessionId" = 'cs_test_xxxxx';
-- Devrait être = 1
```

---

## 📧 Test 6 : Email de Confirmation

### Objectif
Vérifier que l'email est bien envoyé après paiement réussi.

### Configuration Mailtrap (Dev)

```bash
# .env backend
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_password
```

### Étapes

1. Effectuer un paiement réussi
2. Vérifier Mailtrap inbox
3. Vérifier le contenu de l'email

### Contenu Attendu

```
✅ Confirmation de votre réservation MSParking

Bonjour [Nom],

Votre réservation a bien été confirmée !

📅 Départ : [Date]
📅 Retour : [Date]
🚗 Transport : Navette gratuite
💰 Montant : [XX.XX]€

ID Réservation : [booking-id]

[Bouton] Voir ma réservation

Cordialement,
L'équipe MSParking
```

---

## 🌐 Test 7 : Navigation Utilisateur

### Test 7A : Fermeture du Navigateur

**Scénario** : User ferme le navigateur pendant le processing

1. Effectuer un paiement
2. Pendant le "Traitement en cours...", fermer l'onglet
3. Vérifier que la réservation est créée quand même

**Résultat** : ✅ Webhook traite indépendamment, réservation créée

### Test 7B : Bouton Retour du Navigateur

**Scénario** : User clique sur "Retour" pendant processing

1. Effectuer un paiement
2. Sur `/paiement/retour`, cliquer sur "←" du navigateur
3. Revenir sur la page

**Résultat** : ✅ La vérification se relance correctement

### Test 7C : Rafraîchissement de Page

**Scénario** : User rafraîchit la page pendant processing

1. Effectuer un paiement
2. Sur `/paiement/retour`, F5 (refresh)
3. Observer le comportement

**Résultat** : ✅ La vérification redémarre depuis le début

---

## 🔐 Test 8 : Sécurité

### Test 8A : Session ID Invalide

```bash
# Accéder directement à :
http://localhost:3001/paiement/retour?session_id=fake_session_id
```

**Résultat Attendu** :
- ✅ Erreur : "Session de paiement introuvable"
- ✅ Bouton "Retour à l'accueil"

### Test 8B : Sans Session ID

```bash
# Accéder sans paramètre :
http://localhost:3001/paiement/retour
```

**Résultat Attendu** :
- ✅ Erreur : "Session de paiement introuvable"

### Test 8C : Webhook Sans Signature

```bash
# Envoyer un webhook sans signature Stripe
curl -X POST http://localhost:3000/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "checkout.session.completed"}'
```

**Résultat Attendu** :
- ✅ Backend rejette : "Webhook signature verification failed"
- ❌ Pas de traitement

---

## 📊 Test 9 : Charge (Optionnel)

### Objectif
Tester plusieurs paiements simultanés.

### Outil : Artillery

```bash
npm install -g artillery

# Créer un fichier test-load.yml
artillery run test-load.yml
```

### Scénario

```yaml
# test-load.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5 # 5 paiements/seconde

scenarios:
  - name: "Payment flow"
    flow:
      - post:
          url: "/stripe/create-session-with-line-items"
          json:
            userId: "test-user"
            totalAmount: 45.00
            # ... autres champs
```

### Résultat Attendu

- ✅ Tous les webhooks traités
- ✅ Aucune perte de données
- ✅ Temps de réponse < 5s

---

## 🐛 Débogage

### Logs à Activer

**Frontend** :
```typescript
// app/paiement/retour/page.tsx
console.log('[PAYMENT RETURN]', { sessionId, status, retryCount });
```

**Backend** :
```typescript
// Partout
console.log('[STRIPE WEBHOOK]', event.type);
console.log('[PAYMENT SESSION]', sessionId, status);
console.log('[BOOKING CREATED]', bookingId);
```

**Stripe CLI** :
```bash
stripe listen --print-json
```

### Checklist de Débogage

Si un test échoue :

1. ✅ Vérifier les logs frontend (Console Chrome)
2. ✅ Vérifier les logs backend (Terminal)
3. ✅ Vérifier Stripe CLI (si webhook)
4. ✅ Vérifier la base de données (PaymentSession, Booking)
5. ✅ Vérifier Stripe Dashboard > Webhooks

---

## ✅ Checklist Globale de Tests

Avant de déployer en production :

### Frontend
- [ ] Test 1 : Paiement réussi ✅
- [ ] Test 2 : Webhook lent ✅
- [ ] Test 3 : Paiement échoué ✅
- [ ] Test 4 : Timeout 20s ✅
- [ ] Test 7 : Navigation (fermeture, retour, refresh) ✅

### Backend
- [ ] Test 5 : Idempotence ✅
- [ ] Test 6 : Email envoyé ✅
- [ ] Test 8 : Sécurité (session invalide, webhook sans signature) ✅

### Optionnel
- [ ] Test 9 : Charge (5 paiements/s) ✅

---

## 📈 Métriques à Surveiller Après Déploiement

```sql
-- Temps moyen de traitement
SELECT 
  AVG(EXTRACT(EPOCH FROM ("paidAt" - "createdAt"))) as avg_seconds
FROM "PaymentSession"
WHERE status = 'PAID'
  AND "createdAt" > NOW() - INTERVAL '24 hours';

-- Taux de succès
SELECT 
  status, 
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM "PaymentSession"
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY status;

-- Sessions bloquées (> 30s en PENDING)
SELECT COUNT(*)
FROM "PaymentSession"
WHERE status = 'PENDING'
  AND "createdAt" < NOW() - INTERVAL '30 seconds';
```

---

## 🎯 Critères de Validation

| Critère | Objectif | Status |
|---------|----------|--------|
| Taux de succès | > 98% | [ ] |
| Temps moyen | < 5s | [ ] |
| Emails envoyés | 100% | [ ] |
| Pas de doublon | 0 | [ ] |
| Sécurité webhook | 100% | [ ] |

---

**✅ Une fois tous les tests passés : Prêt pour la production !**

*Dernière mise à jour : 3 décembre 2025*
