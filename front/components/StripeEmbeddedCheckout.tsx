"use client";

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Charge la clé publishable Stripe (à stocker dans .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeEmbeddedCheckoutProps {
  clientSecret: string;
}

export default function StripeEmbeddedCheckout({ clientSecret }: StripeEmbeddedCheckoutProps) {
  if (!clientSecret) {
    return <div>Chargement du paiement...</div>;
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
