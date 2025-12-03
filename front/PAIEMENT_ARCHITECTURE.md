# Architecture de Paiement Recommandée

## 🎯 Flux Complet

### 1. Initialisation du Paiement
```
Frontend → /api/stripe/init → Backend
Backend crée une session Stripe avec metadata (user_id, dates, etc.)
Backend stocke session_id en DB avec statut "PENDING"
Frontend reçoit clientSecret
```

### 2. Paiement Stripe (Embedded Checkout)
```
User complète le paiement
Stripe gère tout (3D Secure, carte, etc.)
```

### 3. Webhook (Le Plus Important !)
```
Stripe → /api/stripe/webhook → Backend
Backend vérifie la signature Stripe
Backend met à jour statut "PAID" en DB
Backend crée la réservation (Booking)
Backend envoie email de confirmation
```

### 4. Page de Retour (Vérification Finale)
```
Stripe redirige → /paiement/retour?session_id=xxx
Frontend → Backend : "Quel est le statut de cette session ?"
Backend vérifie en DB (pas Stripe API)
Si PAID → Succès
Si PENDING → Attente (le webhook arrive)
Si FAILED → Erreur
```

## 🏗️ Modifications à Apporter

### Backend

#### 1. Table PaymentSession (nouvelle ou existante)
```prisma
model PaymentSession {
  id          String   @id @default(uuid())
  sessionId   String   @unique // session_id de Stripe
  status      PaymentStatus @default(PENDING)
  amount      Float
  metadata    Json     // Infos de réservation
  bookingId   String?  // Lié à la réservation créée
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum PaymentStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
  CANCELLED
}
```

#### 2. Endpoint verify-session amélioré
```typescript
// Backend: stripe.controller.ts
async verifySession(sessionId: string) {
  // Récupère depuis la DB (pas Stripe API)
  const payment = await this.prisma.paymentSession.findUnique({
    where: { sessionId },
    include: { booking: true }
  });

  if (!payment) {
    return { status: 'error', message: 'Session introuvable' };
  }

  // Si le paiement est validé mais pas encore traité par webhook
  if (payment.status === 'PENDING') {
    // Optionnel : vérifier auprès de Stripe si ça fait > 30s
    const stripe = await this.stripeService.getSession(sessionId);
    if (stripe.payment_status === 'paid') {
      // Le webhook n'est pas encore arrivé, forcer le traitement
      await this.handlePaymentSuccess(sessionId);
      return { status: 'success', bookingId: payment.bookingId };
    }
    return { status: 'pending', message: 'Paiement en cours de traitement' };
  }

  if (payment.status === 'PAID') {
    return { 
      status: 'success', 
      bookingId: payment.bookingId,
      booking: payment.booking 
    };
  }

  return { status: 'error', message: 'Paiement échoué' };
}
```

#### 3. Webhook Handler (le plus important)
```typescript
// Backend: webhooks/stripe.controller.ts
async handleWebhook(rawBody: string, signature: string) {
  const event = this.stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

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
  }
}

private async handleCheckoutCompleted(session: any) {
  const sessionId = session.id;
  const paymentStatus = session.payment_status; // 'paid' | 'unpaid'

  // Mettre à jour le statut
  await this.prisma.paymentSession.update({
    where: { sessionId },
    data: { 
      status: paymentStatus === 'paid' ? 'PAID' : 'PROCESSING' 
    }
  });

  if (paymentStatus === 'paid') {
    // Créer la réservation immédiatement
    await this.createBookingFromPayment(sessionId);
  }
}

private async createBookingFromPayment(sessionId: string) {
  const payment = await this.prisma.paymentSession.findUnique({
    where: { sessionId }
  });

  const metadata = payment.metadata as any;

  // Créer la réservation
  const booking = await this.prisma.booking.create({
    data: {
      userId: metadata.userId,
      departureDate: metadata.departureDate,
      returnDate: metadata.returnDate,
      transportType: metadata.transportType,
      totalAmount: payment.amount,
      status: 'CONFIRMED',
      // ... autres champs
    }
  });

  // Lier le booking au payment
  await this.prisma.paymentSession.update({
    where: { sessionId },
    data: { bookingId: booking.id }
  });

  // Envoyer email de confirmation
  await this.mailService.sendBookingConfirmation(booking);

  return booking;
}
```

### Frontend

#### Page /paiement/retour améliorée
```typescript
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentReturn() {
  const [status, setStatus] = useState<"pending" | "processing" | "success" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const verifyPayment = async () => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("Session de paiement introuvable.");
      return;
    }

    try {
      const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      const data = await res.json();

      if (data.status === "success") {
        setStatus("success");
        sessionStorage.removeItem("bookingDetails");
      } else if (data.status === "pending") {
        // Le webhook n'est pas encore arrivé
        setStatus("processing");
        
        // Réessayer jusqu'à 10 fois (toutes les 2 secondes = 20s max)
        if (retryCount < 10) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          // Après 20s, considérer comme succès quand même (le webhook finira par arriver)
          setStatus("success");
          setErrorMessage("Votre paiement est validé. Vous recevrez un email de confirmation sous peu.");
        }
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Le paiement n'a pas pu être vérifié.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Erreur réseau lors de la vérification du paiement.");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [retryCount]);

  if (status === "pending" || status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        {status === "processing" ? (
          <>
            <Clock className="w-12 h-12 text-blue-600 mb-4 animate-pulse" />
            <p className="text-lg font-semibold mb-2">Traitement du paiement en cours...</p>
            <p className="text-sm text-gray-600">Veuillez patienter quelques instants</p>
          </>
        ) : (
          <>
            <Loader2 className="animate-spin w-12 h-12 text-navy mb-4" />
            <p className="text-lg">Vérification de votre paiement...</p>
          </>
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
        <h2 className="text-3xl font-bold mb-2 text-navy">Paiement validé !</h2>
        <p className="text-lg mb-2">Merci pour votre réservation 🎉</p>
        <p className="text-gray-600 mb-6">
          Un email de confirmation vous a été envoyé avec tous les détails de votre réservation.
        </p>
        {errorMessage && (
          <p className="text-sm text-gray-500 mb-4">{errorMessage}</p>
        )}
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href="/profil">Voir ma réservation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <XCircle className="w-16 h-16 text-red-600 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-navy">Erreur de paiement</h2>
      <p className="text-gray-600 mb-6">
        {errorMessage || "Une erreur est survenue lors de la vérification."}
      </p>
      <div className="flex gap-4">
        <Button asChild variant="default">
          <Link href="/#devis">Réessayer</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contacter le support</Link>
        </Button>
      </div>
    </div>
  );
}

export default function StripeReturnPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin w-12 h-12 text-navy mb-4" />
        <p className="text-lg">Chargement...</p>
      </div>
    }>
      <PaymentReturn />
    </Suspense>
  );
}
```

## 🔒 Sécurité & Bonnes Pratiques

### 1. ✅ Toujours Valider avec le Webhook
- **Jamais** créer une réservation depuis le frontend
- **Toujours** attendre la confirmation du webhook Stripe
- Le webhook est la **source de vérité**

### 2. ✅ Idempotence
- Vérifier que la réservation n'existe pas déjà (éviter les doublons)
- Utiliser des IDs uniques (session_id de Stripe)

### 3. ✅ Gestion du Délai
- Le webhook peut prendre 1-30 secondes
- Implémenter un mécanisme de retry côté frontend
- Afficher un état "processing" à l'utilisateur

### 4. ✅ Fallback
- Si après 20-30s le webhook n'est pas arrivé :
  - Afficher succès quand même
  - Envoyer un email dès que le webhook arrive
  - Logger pour investigation

## 📧 Emails

### Quand Envoyer ?
- ✅ **Dans le webhook** (après création de la réservation)
- ❌ **PAS** depuis la page de retour

### Pourquoi ?
- Le webhook est garanti d'être appelé (retry automatique de Stripe)
- La page de retour peut ne jamais être chargée (user ferme le navigateur)

## 🐛 Débogage

### Logs à Ajouter
```typescript
// Backend webhook
console.log('[STRIPE WEBHOOK]', event.type, event.id);
console.log('[PAYMENT SESSION]', sessionId, 'status:', status);
console.log('[BOOKING CREATED]', booking.id);

// Frontend verify
console.log('[VERIFY PAYMENT]', sessionId, 'attempt:', retryCount);
console.log('[PAYMENT STATUS]', status, errorMessage);
```

## 📊 Résumé

| Aspect | Votre Système Actuel | Recommandation |
|--------|---------------------|----------------|
| Vérification | ❓ Vérifier via Stripe API | ✅ Vérifier en DB |
| Race Condition | ⚠️ Possible | ✅ Résolu avec retry |
| Webhook | ✅ En place | ✅ Améliorer gestion |
| UX Attente | ❌ Pas d'état "processing" | ✅ Ajouter état |
| Retry Logic | ❌ Absent | ✅ Implémenter |
| Email | ❓ Non documenté | ✅ Dans webhook |

## ✅ Conclusion

Votre approche actuelle est **BONNE** mais nécessite des améliorations pour gérer le **timing du webhook**.

**Actions Prioritaires** :
1. ✅ Ajouter une table PaymentSession en DB
2. ✅ Stocker le statut en DB dans le webhook
3. ✅ Vérifier la DB (pas Stripe) dans verify-session
4. ✅ Ajouter un état "processing" avec retry
5. ✅ Envoyer emails depuis le webhook uniquement

Voulez-vous que j'implémente ces améliorations dans votre code ?
