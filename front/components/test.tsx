"use client";

import { useRouter } from "next/navigation";
import { format, differenceInHours } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuoteData, SimplifiedQuoteData } from "@/lib/types";

interface QuoteResultProps {
  quote: QuoteData;
}

const calculatePrice = (quote: QuoteData): number => {
  const departureDateTime = new Date(`${format(quote.departureDate, "yyyy-MM-dd")}T${quote.departureTime}`);
  const returnDateTime = new Date(`${format(quote.returnDate, "yyyy-MM-dd")}T${quote.returnTime}`);

  const durationDays = Math.ceil(differenceInHours(returnDateTime, departureDateTime) / 24);
  const basePricePerDay = 25;

  let totalPrice = Math.max(1, durationDays) * basePricePerDay;

  const luxuryBrands = ['mercedes', 'bmw', 'audi', 'tesla', 'porsche', 'ferrari', 'lamborghini'];
  const carModelLower = quote.carModel.toLowerCase();

  if (luxuryBrands.some(brand => carModelLower.includes(brand))) {
    totalPrice *= 1.5;
  }

  return totalPrice;
};

const QuoteResult = ({ quote }: QuoteResultProps) => {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const price = calculatePrice(quote);
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  const departureDate = format(quote.departureDate, "EEEE d MMMM yyyy", { locale: fr });
  const returnDate = format(quote.returnDate, "EEEE d MMMM yyyy", { locale: fr });

  const saveQuote = () => {
    setTimeout(() => {
      setSaved(true);
      toast.success("Devis enregistré avec succès");
    }, 1000);
  };

  const handleQuoteValidation = () => {
    const simplifiedQuote: SimplifiedQuoteData = {
      departureDate: quote.departureDate,
      departureTime: quote.departureTime,
      returnDate: quote.returnDate,
      returnTime: quote.returnTime,
    };

    localStorage.setItem("quoteData", JSON.stringify(simplifiedQuote));
    router.push("/quote-validation");
  };

  return (
    <div className="animate-fade-in">
      <h2 className="section-heading text-center">Votre Devis</h2>

      <Card className="max-w-2xl mx-auto border-2 border-gold/30">
        <CardHeader className="bg-navy text-white">
          <CardTitle className="text-2xl flex justify-between items-center">
            <span>Estimation de prix</span>
            <span className="text-gold-light text-3xl font-bold">{formattedPrice}</span>
          </CardTitle>
          <CardDescription className="text-gray-200">
            Service de voiturier et gardiennage
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-navy">Informations sur la demande</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-gray-600">Lieu:</div>
              <div className="font-medium">{quote.location || "Non spécifié"}</div>

              <div className="text-gray-600">Départ:</div>
              <div className="font-medium">
                {departureDate} à {quote.departureTime}
              </div>

              <div className="text-gray-600">Retour:</div>
              <div className="font-medium">
                {returnDate} à {quote.returnTime}
              </div>

              <div className="text-gray-600">Véhicule:</div>
              <div className="font-medium">{quote.carModel || "Non spécifié"}</div>
            </div>
          </div>

          {(quote.name || quote.email || quote.phone) && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-lg text-navy">Coordonnées client</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {quote.name && (
                  <>
                    <div className="text-gray-600">Nom:</div>
                    <div className="font-medium">{quote.name}</div>
                  </>
                )}

                {quote.email && (
                  <>
                    <div className="text-gray-600">Email:</div>
                    <div className="font-medium">{quote.email}</div>
                  </>
                )}

                {quote.phone && (
                  <>
                    <div className="text-gray-600">Téléphone:</div>
                    <div className="font-medium">{quote.phone}</div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <p className="text-sm text-gray-600">
              Ce devis est une estimation basée sur les informations fournies. Le prix final peut varier en fonction 
              des services additionnels et de la durée exacte de gardiennage.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              Imprimer
            </Button>

            <Button variant="outline" onClick={saveQuote} disabled={saved}>
              {saved ? "Enregistré" : "Enregistrer"}
            </Button>
          </div>

          <Button
            className="bg-gold hover:bg-gold-dark text-navy font-bold"
            onClick={handleQuoteValidation}
            disabled={isValidated}
          >
            {isValidated ? "Demande validée" : "Valider ma demande"}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center mt-8">
        <p className="mb-4">
          Vous avez des questions ou souhaitez réserver dès maintenant ?
        </p>
        <Button className="bg-navy hover:bg-navy-light">
          <a href="#contact">Contactez-nous</a>
        </Button>
      </div>
    </div>
  );
};

export default QuoteResult;
