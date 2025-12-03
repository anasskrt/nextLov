# 🔧 Modifications Backend Requises - Système de Paiement Amélioré

**Date** : 3 décembre 2025  
**Objectif** : Implémenter le système de retry pour la vérification des paiements

---

## 📋 Vue d'Ensemble

Le frontend a été amélioré pour gérer le délai entre la redirection de paiement et l'arrivée du webhook Stripe. Le backend doit maintenant :

1. ✅ Stocker l'état des sessions de paiement en base de données
2. ✅ Mettre à jour cet état lors de la réception du webhook
3. ✅ Retourner l'état correct lors de la vérification

---

## 🗄️ ÉTAPE 1 : Modification du Schéma Prisma

### Ajouter ou Modifier le Modèle PaymentSession

```prisma
// prisma/schema.prisma

model PaymentSession {
  id              String        @id @default(uuid())
  sessionId       String        @unique // session_id de Stripe
  status          PaymentStatus @default(PENDING)
  amount          Float
  currency        String        @default("eur")
  
  // Métadonnées de la réservation
  metadata        Json          // Contient: userId, dates, transport, services, etc.
  
  // Relations
  bookingId       String?       @unique
  booking         Booking?      @relation(fields: [bookingId], references: [id])
  
  // Stripe info
  paymentIntentId String?
  customerId      String?
  
  // Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  paidAt          DateTime?     // Date de validation du paiement
  
  @@index([sessionId])
  @@index([status])
}

enum PaymentStatus {
  PENDING       // Session créée, paiement non confirmé
  PROCESSING    // Paiement en cours de traitement
  PAID          // Paiement confirmé, réservation créée
  FAILED        // Paiement échoué
  CANCELLED     // Paiement annulé par l'utilisateur
  REFUNDED      // Paiement remboursé
}
```

### Commandes à Exécuter

```bash
# Générer la migration
npx prisma migrate dev --name add_payment_session

# Générer le client Prisma
npx prisma generate
```

---

## 🔧 ÉTAPE 2 : Modifier stripe.service.ts

### A. Méthode createSessionWithLineItems

Lors de la création de la session Stripe, **sauvegarder** en base de données :

```typescript
// src/stripe/stripe.service.ts

async createSessionWithLineItems(dto: CreateCheckoutSessionDto) {
  // 1. Créer la session Stripe (code existant)
  const session = await this.stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: stripeLineItems,
    mode: 'payment',
    return_url: `${process.env.FRONTEND_URL}/paiement/retour?session_id={CHECKOUT_SESSION_ID}`,
    locale: 'fr',
    metadata: {
      userId: dto.userId,
      departureDate: dto.departureDate,
      returnDate: dto.returnDate,
      transportType: dto.transportType,
      // ... autres métadonnées
    },
  });

  // 2. 🆕 NOUVEAU : Sauvegarder en base de données
  await this.prisma.paymentSession.create({
    data: {
      sessionId: session.id,
      status: 'PENDING', // État initial
      amount: dto.totalAmount,
      currency: 'eur',
      metadata: {
        userId: dto.userId,
        departureDate: dto.departureDate,
        returnDate: dto.returnDate,
        transportType: dto.transportType,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        services: dto.services || [],
        // ... toutes les infos nécessaires pour créer la réservation
      },
      customerId: session.customer as string,
      paymentIntentId: session.payment_intent as string,
    },
  });

  return { clientSecret: session.client_secret };
}
```

---

## 🔍 ÉTAPE 3 : Modifier stripe.controller.ts - verifySession

**IMPORTANT** : Cette méthode ne doit **PLUS** appeler l'API Stripe, mais lire depuis la base de données.

```typescript
// src/stripe/stripe.controller.ts

@Get('verify-session')
async verifySession(@Query('session_id') sessionId: string) {
  if (!sessionId) {
    return {
      status: 'error',
      message: 'Session ID manquant',
    };
  }

  try {
    // 🆕 LIRE DEPUIS LA BASE DE DONNÉES (pas Stripe API)
    const paymentSession = await this.prisma.paymentSession.findUnique({
      where: { sessionId },
      include: {
        booking: true, // Inclure la réservation si créée
      },
    });

    // Session introuvable
    if (!paymentSession) {
      return {
        status: 'error',
        message: 'Session de paiement introuvable',
      };
    }

    // Gérer les différents statuts
    switch (paymentSession.status) {
      case 'PAID':
        return {
          status: 'success',
          message: 'Paiement confirmé',
          bookingId: paymentSession.bookingId,
          booking: paymentSession.booking,
        };

      case 'PENDING':
      case 'PROCESSING':
        // 🆕 Le webhook n'est pas encore arrivé
        // On peut optionnellement vérifier auprès de Stripe si ça fait > 30s
        const timeSinceCreation = Date.now() - paymentSession.createdAt.getTime();
        
        if (timeSinceCreation > 30000) {
          // Plus de 30 secondes, vérifier avec Stripe en fallback
          const stripeSession = await this.stripe.checkout.sessions.retrieve(sessionId);
          
          if (stripeSession.payment_status === 'paid') {
            // Le webhook n'est pas arrivé mais Stripe dit que c'est payé
            // Forcer le traitement
            await this.handlePaymentSuccess(sessionId);
            
            return {
              status: 'success',
              message: 'Paiement confirmé',
              bookingId: paymentSession.bookingId,
            };
          }
        }

        return {
          status: 'pending',
          message: 'Paiement en cours de traitement',
        };

      case 'FAILED':
        return {
          status: 'error',
          message: 'Le paiement a échoué',
        };

      case 'CANCELLED':
        return {
          status: 'error',
          message: 'Le paiement a été annulé',
        };

      default:
        return {
          status: 'error',
          message: 'Statut de paiement inconnu',
        };
    }
  } catch (error) {
    console.error('[VERIFY SESSION ERROR]', error);
    return {
      status: 'error',
      message: 'Erreur lors de la vérification du paiement',
    };
  }
}
```

---

## 🎣 ÉTAPE 4 : Webhook Handler (Le Plus Important)

### A. Gérer l'événement checkout.session.completed

```typescript
// src/webhooks/stripe-webhook.controller.ts

@Post('stripe')
async handleStripeWebhook(
  @Req() req: Request,
  @Headers('stripe-signature') signature: string,
) {
  const rawBody = req.body; // Raw body pour vérifier la signature

  try {
    // 1. Vérifier la signature Stripe
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log('[STRIPE WEBHOOK]', event.type, event.id);

    // 2. Gérer les différents événements
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;

      case 'charge.refunded':
        await this.handleRefund(event.data.object);
        break;
    }

    return { received: true };
  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    throw new BadRequestException('Webhook signature verification failed');
  }
}

// Gérer la complétion du checkout
private async handleCheckoutCompleted(session: any) {
  const sessionId = session.id;
  const paymentStatus = session.payment_status; // 'paid' | 'unpaid' | 'no_payment_required'

  console.log('[CHECKOUT COMPLETED]', sessionId, 'status:', paymentStatus);

  // Mettre à jour le statut en base
  await this.prisma.paymentSession.update({
    where: { sessionId },
    data: {
      status: paymentStatus === 'paid' ? 'PAID' : 'PROCESSING',
      paymentIntentId: session.payment_intent,
      updatedAt: new Date(),
    },
  });

  // Si le paiement est confirmé, créer la réservation
  if (paymentStatus === 'paid') {
    await this.handlePaymentSuccess(sessionId);
  }
}

// Créer la réservation après paiement confirmé
private async handlePaymentSuccess(sessionId: string) {
  console.log('[PAYMENT SUCCESS] Creating booking for session:', sessionId);

  // 1. Récupérer la session de paiement
  const paymentSession = await this.prisma.paymentSession.findUnique({
    where: { sessionId },
  });

  if (!paymentSession) {
    console.error('[PAYMENT SUCCESS] Session not found:', sessionId);
    return;
  }

  // 2. Vérifier si la réservation n'existe pas déjà (idempotence)
  if (paymentSession.bookingId) {
    console.log('[PAYMENT SUCCESS] Booking already exists:', paymentSession.bookingId);
    return;
  }

  // 3. Extraire les métadonnées
  const metadata = paymentSession.metadata as any;

  // 4. Créer la réservation
  const booking = await this.prisma.booking.create({
    data: {
      userId: metadata.userId,
      departureDate: new Date(metadata.departureDate),
      returnDate: new Date(metadata.returnDate),
      departureTime: metadata.departureTime,
      returnTime: metadata.returnTime,
      transportType: metadata.transportType,
      totalAmount: paymentSession.amount,
      status: 'CONFIRMED',
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      customerPhone: metadata.customerPhone,
      flightNumber: metadata.flightNumber || null,
      // ... autres champs selon votre schéma
    },
  });

  console.log('[BOOKING CREATED]', booking.id);

  // 5. Créer les services additionnels si présents
  if (metadata.services && metadata.services.length > 0) {
    await this.prisma.bookingService.createMany({
      data: metadata.services.map((service: any) => ({
        bookingId: booking.id,
        serviceId: service.id,
        quantity: service.quantity || 1,
        price: service.price,
      })),
    });
  }

  // 6. Lier la réservation à la session de paiement
  await this.prisma.paymentSession.update({
    where: { sessionId },
    data: {
      bookingId: booking.id,
      status: 'PAID',
      paidAt: new Date(),
    },
  });

  // 7. Envoyer l'email de confirmation
  try {
    await this.mailService.sendBookingConfirmation({
      to: metadata.customerEmail,
      customerName: metadata.customerName,
      bookingId: booking.id,
      departureDate: booking.departureDate,
      returnDate: booking.returnDate,
      totalAmount: booking.totalAmount,
      // ... autres infos
    });
    console.log('[EMAIL SENT] Confirmation sent to:', metadata.customerEmail);
  } catch (emailError) {
    console.error('[EMAIL ERROR]', emailError);
    // Ne pas bloquer si l'email échoue
  }

  return booking;
}

// Gérer les paiements échoués
private async handlePaymentFailed(paymentIntent: any) {
  const sessionId = paymentIntent.metadata?.sessionId;
  
  if (sessionId) {
    await this.prisma.paymentSession.update({
      where: { sessionId },
      data: {
        status: 'FAILED',
        updatedAt: new Date(),
      },
    });
    console.log('[PAYMENT FAILED]', sessionId);
  }
}

// Gérer les remboursements
private async handleRefund(charge: any) {
  const paymentIntentId = charge.payment_intent;
  
  const paymentSession = await this.prisma.paymentSession.findFirst({
    where: { paymentIntentId },
  });

  if (paymentSession) {
    await this.prisma.paymentSession.update({
      where: { id: paymentSession.id },
      data: {
        status: 'REFUNDED',
        updatedAt: new Date(),
      },
    });

    // Mettre à jour le statut de la réservation
    if (paymentSession.bookingId) {
      await this.prisma.booking.update({
        where: { id: paymentSession.bookingId },
        data: { status: 'CANCELLED' },
      });
    }

    console.log('[REFUND PROCESSED]', paymentSession.sessionId);
  }
}
```

---

## 📧 ÉTAPE 5 : Service d'Email

### Créer ou Modifier mail.service.ts

```typescript
// src/mail/mail.service.ts

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendBookingConfirmation(data: {
    to: string;
    customerName: string;
    bookingId: string;
    departureDate: Date;
    returnDate: Date;
    totalAmount: number;
    // ... autres champs
  }) {
    const { to, customerName, bookingId, departureDate, returnDate, totalAmount } = data;

    await this.mailer.sendMail({
      to,
      subject: '✅ Confirmation de votre réservation MSParking',
      template: 'booking-confirmation', // Template HTML
      context: {
        customerName,
        bookingId,
        departureDate: departureDate.toLocaleDateString('fr-FR'),
        returnDate: returnDate.toLocaleDateString('fr-FR'),
        totalAmount: totalAmount.toFixed(2),
        // ... autres variables
      },
    });

    console.log('[MAIL SENT] Booking confirmation to:', to);
  }
}
```

---

## 🧪 ÉTAPE 6 : Tests

### A. Tester la Création de Session

```bash
# Via Postman ou curl
POST http://localhost:3000/stripe/create-session-with-line-items
Content-Type: application/json

{
  "userId": "user-123",
  "departureDate": "2025-12-10",
  "returnDate": "2025-12-17",
  "transportType": "NAVETTE",
  "totalAmount": 45.00,
  "customerName": "Jean Dupont",
  "customerEmail": "jean.dupont@example.com",
  "customerPhone": "0612345678"
}

# Vérifier en DB
SELECT * FROM "PaymentSession" ORDER BY "createdAt" DESC LIMIT 1;
# Devrait avoir status = 'PENDING'
```

### B. Tester le Webhook Localement

Utilisez Stripe CLI pour simuler des webhooks :

```bash
# Installer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/webhooks/stripe

# Déclencher un événement de test
stripe trigger checkout.session.completed

# Vérifier les logs
# Le webhook devrait créer la réservation
```

### C. Tester la Vérification

```bash
GET http://localhost:3000/stripe/verify-session?session_id=cs_test_xxx

# Réponses attendues :
# - Avant webhook : { "status": "pending" }
# - Après webhook : { "status": "success", "bookingId": "..." }
```

---

## 🔒 ÉTAPE 7 : Sécurité

### Variables d'Environnement

```bash
# .env

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # ⚠️ IMPORTANT pour vérifier les webhooks

# Frontend URL
FRONTEND_URL=https://msparking.fr  # ou http://localhost:3001 en dev

# Database
DATABASE_URL=postgresql://...
```

### Vérification de Signature Webhook

```typescript
// Toujours vérifier la signature Stripe
const event = this.stripe.webhooks.constructEvent(
  rawBody,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET,
);
// ⚠️ Si la signature est invalide, rejeter la requête
```

---

## 📊 ÉTAPE 8 : Monitoring & Logs

### Logs à Ajouter

```typescript
// Dans chaque méthode importante
console.log('[PAYMENT SESSION CREATED]', sessionId, 'amount:', amount);
console.log('[WEBHOOK RECEIVED]', event.type, event.id);
console.log('[BOOKING CREATED]', bookingId, 'for user:', userId);
console.log('[EMAIL SENT]', email, 'booking:', bookingId);
console.error('[ERROR]', context, error.message);
```

### Métriques à Surveiller

1. **Temps moyen** entre session créée et webhook reçu
2. **Taux de sessions PENDING** > 30 secondes
3. **Taux d'échec** de création de réservation
4. **Taux d'échec** d'envoi d'email

---

## ✅ Checklist de Déploiement

Avant de déployer en production :

- [ ] Migration Prisma appliquée
- [ ] Webhook Stripe configuré (URL : https://msparking.fr/webhooks/stripe)
- [ ] Variable STRIPE_WEBHOOK_SECRET définie
- [ ] Tests effectués avec Stripe CLI
- [ ] Email de confirmation testé
- [ ] Logs ajoutés dans toutes les méthodes critiques
- [ ] Gestion d'erreur robuste (try/catch partout)
- [ ] Idempotence vérifiée (pas de doublon de réservation)
- [ ] Timeout de 30s configuré pour le fallback Stripe API

---

## 🆘 Dépannage

### Problème : Le webhook n'arrive jamais

**Causes possibles** :
- URL du webhook mal configurée dans Stripe Dashboard
- Serveur backend non accessible publiquement (utiliser ngrok en dev)
- Signature webhook invalide

**Solutions** :
```bash
# Vérifier les webhooks dans Stripe Dashboard
https://dashboard.stripe.com/webhooks

# Tester avec ngrok en dev
ngrok http 3000
# Puis configurer l'URL ngrok dans Stripe
```

### Problème : Doublon de réservations

**Solution** : Vérifier l'idempotence
```typescript
// Toujours vérifier avant de créer
if (paymentSession.bookingId) {
  console.log('Booking already exists');
  return;
}
```

### Problème : Email non envoyé

**Solution** : Ne jamais bloquer sur l'email
```typescript
try {
  await this.mailService.send(...);
} catch (error) {
  console.error('[EMAIL ERROR]', error);
  // NE PAS throw, continuer le traitement
}
```

---

## 📞 Support

En cas de problème, vérifier dans l'ordre :

1. ✅ Logs du serveur backend
2. ✅ Stripe Dashboard > Webhooks > Événements
3. ✅ Base de données : table PaymentSession
4. ✅ Stripe Dashboard > Paiements

---

## 🎯 Résumé des Modifications

| Fichier | Action | Priorité |
|---------|--------|----------|
| `schema.prisma` | Ajouter modèle PaymentSession | 🔴 CRITIQUE |
| `stripe.service.ts` | Sauvegarder session en DB | 🔴 CRITIQUE |
| `stripe.controller.ts` | Lire DB au lieu de Stripe API | 🔴 CRITIQUE |
| `stripe-webhook.controller.ts` | Créer réservation dans webhook | 🔴 CRITIQUE |
| `mail.service.ts` | Envoyer email de confirmation | 🟡 IMPORTANT |
| `.env` | Ajouter STRIPE_WEBHOOK_SECRET | 🔴 CRITIQUE |

---

**Dernière mise à jour** : 3 décembre 2025  
**Version** : 1.0  
**Auteur** : GitHub Copilot
