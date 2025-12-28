/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StripeEmbeddedCheckout from "./StripeEmbeddedCheckout";

interface PaymentFormProps {
  totalAmount: number;
  services: any[];
  userInfo: any;
  bookingDetails: any;
  onBack: () => void;
}

const PaymentForm = ({
  totalAmount,
  services,
  userInfo,
  bookingDetails,
  onBack,
}: PaymentFormProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate the total price of selected services (support both {id, price} and full service objects)
  const servicesTotal = services.reduce((sum, service) => {
    if (typeof service.price === "number") {
      return sum + service.price;
    }
    return sum;
  }, 0);

  let transportPrice = 0;
  if (userInfo && userInfo.selectedTransport && userInfo.selectedTransport.prix) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transportPrice = Number(userInfo.selectedTransport.prix);
  }
  const finalAmount = servicesTotal + totalAmount;
  
  const handlePayment = async () => {
    setIsProcessing(true);

    // Construire les line_items pour Stripe
    const lineItems = [];
    
    // 1. Ligne unique : Gardiennage automobile + Transport
    const transportType = userInfo?.selectedTransport?.type || "Non spécifié";
    lineItems.push({
      name: `Gardiennage automobile + Transport (${transportType})`,
      description: `Du ${bookingDetails.fullDepartureDate ? new Date(bookingDetails.fullDepartureDate).toLocaleDateString("fr-FR") : "-"} au ${bookingDetails.fullReturnDate ? new Date(bookingDetails.fullReturnDate).toLocaleDateString("fr-FR") : "-"}`,
      amount: totalAmount,
      quantity: 1,
    });

    // 2. Lignes services supplémentaires
    services.forEach((service) => {
      if (typeof service.price === "number") {
        lineItems.push({
          name: service.name || "Service supplémentaire",
          description: service.description || "",
          amount: service.price,
          quantity: 1,
        });
      }
    });

    const payload = {
      userInfo,
      services,
      totalAmount: finalAmount,
      bookingDetails,
      lineItems,
      metadata: {
        customerName: userInfo.name,
        customerPhone: userInfo.phone,
        carModel: userInfo.carModel,
        carPlate: userInfo.carPlate || "",
        departureTime: bookingDetails.fullDepartureDate ? new Date(bookingDetails.fullDepartureDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
        returnTime: bookingDetails.fullReturnDate ? new Date(bookingDetails.fullReturnDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
        transportType: userInfo.selectedTransport?.type || "Non spécifié",
        servicesCount: services.length,
      },
    };

    try {
      const res = await fetch("/api/stripe/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          message: "Erreur lors de la création de la réservation" 
        }));
        console.error("Erreur API Stripe:", errorData);
        alert(`Erreur: ${errorData.message || "Impossible de créer la session de paiement"}`);
        setIsProcessing(false);
        return;
      }

      const data = await res.json();
      
      if (!data.client_secret) {
        console.error("Client secret manquant dans la réponse:", data);
        alert("Erreur: Session de paiement invalide. Veuillez réessayer.");
        setIsProcessing(false);
        return;
      }
      
      setClientSecret(data.client_secret);
    } catch (error) {
      console.error("Erreur lors de l'initialisation du paiement:", error);
      alert("Une erreur est survenue lors de l'initialisation du paiement. Veuillez vérifier votre connexion et réessayer.");
      setIsProcessing(false);
    }
  };

  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(finalAmount);

  if (clientSecret) {
    return <StripeEmbeddedCheckout clientSecret={clientSecret} />;
  }
  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-navy">
        Finaliser votre réservation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Récapitulatif */}
        <Card>
          <CardHeader>
            <CardTitle className="text-navy">
              Récapitulatif de votre commande
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-navy mb-2">
                Services supplémentaires sélectionnés:
              </h4>
              {services.length === 0 && <div>Aucun service sélectionné</div>}
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1"
                >
                  <span>{service.name || service.id}</span>
                  <span className="font-semibold">
                    {typeof service.price === "number"
                      ? `${service.price}€`
                      : service.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2">
              <div>
                <h4 className="font-semibold text-navy mb-2">
                  Transport sélectionnés:
                </h4>
                <div className="flex justify-between items-center py-1">
                  <span>{userInfo.selectedTransport.type}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-2">
              <h4 className="font-semibold text-navy mb-2">
                Informations client:
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Nom:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p>
                  <strong>Téléphone:</strong> {userInfo.phone}
                </p>
                <p>
                  <strong>Véhicule:</strong> {userInfo.carModel}
                </p>
              </div>
            </div>

            <div className="border-t pt-2">
              <h4 className="font-semibold text-navy mb-2">Période:</h4>
              <div className="text-sm">
                <p>
                  <strong>Départ :</strong>{" "}
                  {bookingDetails.fullDepartureDate
                    ? new Date(bookingDetails.fullDepartureDate).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "-"}
                  {" à "}
                  {bookingDetails.fullDepartureDate
                    ? new Date(bookingDetails.fullDepartureDate).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "-"}
                </p>
                <p>
                  <strong>Retour :</strong>{" "}
                  {bookingDetails.fullReturnDate
                    ? new Date(bookingDetails.fullReturnDate).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "-"}
                  {" à "}
                  {bookingDetails.fullReturnDate
                    ? new Date(bookingDetails.fullReturnDate).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "-"}
                </p>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-gold">{formattedAmount}</span>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-navy">Paiement sécurisé</CardTitle>
            <CardDescription>
              Votre paiement est sécurisé et protégé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary-red-50 p-4 rounded-lg border border-primary-red-200">
              <h4 className="font-semibold text-primary-red-800 mb-2">
                Informations de paiement
              </h4>
              <p className="text-primary-red-700 text-sm">
                En cliquant sur &quot;Payer maintenant&quot;, vous serez redirigé
                vers une page de paiement sécurisée pour finaliser votre
                réservation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Montant à payer:</h5>
                <div className="text-2xl font-bold text-gold">
                  {formattedAmount}
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 text-lg"
              >
                {isProcessing ? "Traitement en cours..." : "Payer maintenant"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <p className="text-sm text-gray-500">
          Paiement 100% sécurisé avec cryptage SSL
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
