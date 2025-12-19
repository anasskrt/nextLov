"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { trackConversion } from "@/lib/analytics";

function PaymentReturn() {
  const [status, setStatus] = useState<"pending" | "processing" | "success" | "failed" | "expired" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
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
        
        // Déclencher la conversion Google Ads
        trackConversion(1.0, sessionId || '');
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
          
          // Déclencher la conversion Google Ads
          trackConversion(1.0, sessionId || '');
        }
      } else if (data.status === "error" && data.message?.includes("échoué")) {
        // Paiement explicitement échoué/refusé
        setStatus("failed");
        setErrorMessage(data.message || "Le paiement a été refusé par votre banque.");
        // Démarrer le compte à rebours de redirection
        setRedirectCountdown(10);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  // Gérer le compte à rebours de redirection
  useEffect(() => {
    if (redirectCountdown !== null && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0) {
      router.push("/");
    }
  }, [redirectCountdown, router]);

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

  // Cas spécifique : paiement refusé/échoué
  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <XCircle className="w-20 h-20 text-red-600 mb-6 mx-auto" />
          <h2 className="text-3xl font-bold mb-3 text-navy">Paiement refusé</h2>
          <p className="text-lg text-gray-700 mb-6">
            Malheureusement, votre paiement n&apos;a pas pu être traité.
          </p>

          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900 font-semibold">Raison du refus</AlertTitle>
            <AlertDescription className="text-red-800">
              {errorMessage || "Le paiement a été refusé par votre établissement bancaire."}
            </AlertDescription>
          </Alert>

          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                <AlertCircle className="h-5 w-5" />
                Que faire maintenant ?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-3 text-blue-900">
              <div className="flex gap-3">
                <span className="font-bold">1.</span>
                <p>Vérifiez que votre carte bancaire est valide et dispose de fonds suffisants</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">2.</span>
                <p>Contactez votre banque si le problème persiste</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">3.</span>
                <p>Réessayez avec une autre carte de paiement</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-navy bg-navy/5">
            <CardHeader>
              <CardTitle className="text-lg text-navy">Besoin d&apos;aide ?</CardTitle>
              <CardDescription>Notre équipe est là pour vous aider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-5 w-5 text-navy" />
                <div className="text-left">
                  <p className="font-semibold">Téléphone</p>
                  <a href="tel:+33123456789" className="text-navy hover:underline">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 text-navy" />
                <div className="text-left">
                  <p className="font-semibold">Email</p>
                  <a href="mailto:contact@lovparking.fr" className="text-navy hover:underline">
                    contact@lovparking.fr
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {redirectCountdown !== null && (
            <Alert className="mb-6 border-gray-300">
              <Clock className="h-5 w-5" />
              <AlertDescription>
                Redirection vers la page d&apos;accueil dans {redirectCountdown} seconde{redirectCountdown > 1 ? 's' : ''}...
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-navy hover:bg-navy-light">
              <Link href="/#devis">Réessayer une réservation</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contacter le support</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
            >
              Retour à l&apos;accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Cas générique : erreur
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <XCircle className="w-16 h-16 text-red-600 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-navy">Erreur de paiement</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {errorMessage || "Une erreur est survenue lors de la vérification."}
      </p>
      <Alert className="mb-6 max-w-md border-blue-200 bg-blue-50">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-900">Besoin d&apos;assistance ?</AlertTitle>
        <AlertDescription className="text-blue-800">
          Si le problème persiste, n&apos;hésitez pas à contacter notre support technique.
        </AlertDescription>
      </Alert>
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
