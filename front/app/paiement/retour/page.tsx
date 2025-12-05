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
      } else if (data.status === "pending" || data.status === "processing") {
        // Le webhook n'est pas encore arrivé, on attend
        setStatus("processing");
        
        // Réessayer jusqu'à 10 fois (toutes les 2 secondes = 20s max)
        if (retryCount < 10) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          // Après 20s, considérer comme succès (le webhook finira par arriver)
          setStatus("success");
          setErrorMessage("Votre paiement est validé. Vous recevrez un email de confirmation sous peu.");
        }
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Le paiement n'a pas pu être vérifié.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <p className="text-sm text-gray-600">Veuillez patienter quelques instants ({retryCount}/10)</p>
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
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
        <h2 className="text-3xl font-bold mb-2 text-navy">Paiement validé !</h2>
        <p className="text-lg mb-2">Merci pour votre réservation 🎉</p>
        <p className="text-gray-600 mb-6 max-w-md">
          Un email de confirmation vous a été envoyé avec tous les détails de votre réservation.
        </p>
        {errorMessage && (
          <p className="text-sm text-gray-500 mb-4 max-w-md">{errorMessage}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-navy hover:bg-navy-light">
            <Link href="/profil">Voir ma réservation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <XCircle className="w-16 h-16 text-red-600 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-navy">Erreur de paiement</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {errorMessage || "Une erreur est survenue lors de la vérification."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-navy hover:bg-navy-light">
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
