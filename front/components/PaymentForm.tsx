"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Paiement effectué avec succès !");

      // Redirect to home with query param (for toast on landing)
      router.push("/?success=true");
    }, 2000);
  };

  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(totalAmount);

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-navy">Finaliser votre réservation</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Récapitulatif */}
        <Card>
          <CardHeader>
            <CardTitle className="text-navy">Récapitulatif de votre commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-navy mb-2">Services sélectionnés:</h4>
              {services.map((service, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span>{service.name}</span>
                  <span className="font-semibold">{service.price}€</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2">
              <h4 className="font-semibold text-navy mb-2">Informations client:</h4>
              <div className="text-sm space-y-1">
                <p><strong>Nom:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Téléphone:</strong> {userInfo.phone}</p>
                <p><strong>Lieu:</strong> {userInfo.location}</p>
                <p><strong>Véhicule:</strong> {userInfo.carModel}</p>
              </div>
            </div>

            <div className="border-t pt-2">
              <h4 className="font-semibold text-navy mb-2">Période:</h4>
              <div className="text-sm">
                <p><strong>Départ:</strong> {bookingDetails.departureDate?.toLocaleDateString()} à {bookingDetails.departureTime}</p>
                <p><strong>Retour:</strong> {bookingDetails.returnDate?.toLocaleDateString()} à {bookingDetails.returnTime}</p>
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
            <CardDescription>Votre paiement est sécurisé et protégé</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Informations de paiement</h4>
              <p className="text-blue-700 text-sm">
                Dans un vrai projet, ici se trouverait l'intégration avec Stripe ou un autre processeur de paiement.
                Pour cette démonstration, le paiement sera simulé.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Montant à payer:</h5>
                <div className="text-2xl font-bold text-gold">{formattedAmount}</div>
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
