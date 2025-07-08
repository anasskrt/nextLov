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

  let transportPrice = 0;
  if (userInfo && userInfo.selectedTransport && userInfo.selectedTransport.prix) {
    transportPrice = Number(userInfo.selectedTransport.prix);
  }
  const finalAmount = totalAmount + transportPrice;

  const handlePayment = async () => {
    setIsProcessing(true);

    const payload = {
      userInfo,
      services,
      totalAmount: finalAmount,
      bookingDetails,
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
        throw new Error("Erreur lors de la création de la réservation");
      }

      // Optionnel : tu peux lire la réponse ici :
      // const data = await res.json();
      const data = await res.json();
      setClientSecret(data.client_secret);
    } catch {
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
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1"
                >
                  <span>{service.name}</span>
                  <span className="font-semibold">{service.price}€</span>
                </div>
              ))}
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
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-gold">{formattedAmount}</span>
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
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                Informations de paiement
              </h4>
              <p className="text-blue-700 text-sm">
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
