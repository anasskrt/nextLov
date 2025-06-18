"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentReturn() {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("Session de paiement introuvable.");
      return;
    }
    // Appel au back pour vérifier le statut de la session Stripe
    fetch("/api/stripe/verify-session?session_id=" + sessionId)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setStatus("success");
          sessionStorage.removeItem("bookingDetails");
        } else {
          setStatus("error");
          setErrorMessage(data.message || "Le paiement n'a pas pu être vérifié.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Erreur réseau lors de la vérification du paiement.");
      });
  }, [searchParams]);

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin w-12 h-12 text-navy mb-4" />
        <p className="text-lg">Vérification de votre paiement...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Paiement validé !</h2>
        <p className="mb-4">Merci pour votre réservation, un email de confirmation va vous être envoyé.</p>
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    );
  }

  return (      <div className="flex flex-col items-center justify-center h-[70vh]">
        <XCircle className="w-16 h-16 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erreur de paiement</h2>
        <p className="mb-4">{errorMessage || "Une erreur est survenue lors de la vérification."}</p>
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
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
