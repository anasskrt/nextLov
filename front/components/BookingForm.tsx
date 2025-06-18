/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInHours } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const BookingForm = () => {
  const router = useRouter();

  const [apiEstimation, setApiEstimation] = useState<null | {
        nombreJours: number;
        prixBase: number;
        frais: number;
        montantFinal: number;
    }>(null);


  const [formData, setFormData] = useState({
    departureTime: "",
    returnTime: "",
  });

  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDays = () => {
    if (!departureDate || !returnDate || !formData.departureTime || !formData.returnTime) {
      return 1;
    }

    const departureDateTime = new Date(`${format(departureDate, "yyyy-MM-dd")}T${formData.departureTime}`);
    const returnDateTime = new Date(`${format(returnDate, "yyyy-MM-dd")}T${formData.returnTime}`);

    return Math.ceil(differenceInHours(returnDateTime, departureDateTime) / 24) || 1;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateDateTime = () => {
    const newErrors: Record<string, string> = {};
    if (!departureDate) newErrors.departureDate = "La date de départ est requise";
    if (!formData.departureTime) newErrors.departureTime = "L'heure de départ est requise";
    if (!returnDate) newErrors.returnDate = "La date de retour est requise";
    if (!formData.returnTime) newErrors.returnTime = "L'heure de retour est requise";
    if (departureDate && returnDate && departureDate > returnDate) {
      newErrors.returnDate = "La date de retour doit être après la date de départ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const lastPayload = useRef<{ dateDebut: string; dateFin: string } | null>(null);

    useEffect(() => {
    // 1. Vérifie que tout est bien rempli et valide
    const isValid =
        departureDate &&
        returnDate &&
        formData.departureTime &&
        formData.returnTime &&
        Object.keys(errors).length === 0;

    if (!isValid) return;

    // 2. Crée les dates au format ISO
    const dateDebut = new Date(
        `${format(departureDate, "yyyy-MM-dd")}T${formData.departureTime}`
    ).toISOString();
    const dateFin = new Date(
        `${format(returnDate, "yyyy-MM-dd")}T${formData.returnTime}`
    ).toISOString();

    // 3. Empêche d'envoyer 10 fois la même requête si les valeurs ne changent pas
    if (
        lastPayload.current &&
        lastPayload.current.dateDebut === dateDebut &&
        lastPayload.current.dateFin === dateFin
    ) {
        return;
    }
    lastPayload.current = { dateDebut, dateFin };

    // 4. Envoie la requête POST
    fetch(`${process.env.BACKEND_URL}/devis/init`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateDebut, dateFin }),
    })
        .then(async (res) => {
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Erreur inconnue");
        }
        return res.json();
        })
        .then((data) => {
            setApiEstimation(data);
        })
        .catch((err) => {
        toast.error("Erreur lors de la pré-demande", {
            description: err.message,
        });
        });
    }, [
    departureDate,
    returnDate,
    formData.departureTime,
    formData.returnTime,
    errors,
    ]);


    const handleContinue = () => {
    if (!isFormComplete) {
        toast.error("Formulaire incomplet", {
        description: "Veuillez remplir tous les champs obligatoires.",
        });
        return;
    }

    const fullDepartureDate = departureDate && formData.departureTime
    ? new Date(
        `${format(departureDate, "yyyy-MM-dd")}T${formData.departureTime}`
      ).toISOString()
    : null;

  const fullReturnDate = returnDate && formData.returnTime
    ? new Date(
        `${format(returnDate, "yyyy-MM-dd")}T${formData.returnTime}`
      ).toISOString()
    : null;

    sessionStorage.setItem(
        "bookingDetails",
        JSON.stringify({
        fullDepartureDate,
        fullReturnDate,
        estimation: apiEstimation,
        })
    );
    router.push("/booking");
    };


  const isFormComplete = departureDate && returnDate && formData.departureTime && formData.returnTime;
  const days = calculateDays();
  const estimatedPrice = days * 35;

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-navy">Obtenez votre estimation</h2>

      <form className="space-y-4">
        {/* Dates + heures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-navy">Date de départ*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left text-gray-900 font-normal bg-white hover:bg-gray-50",
                    !departureDate && "text-muted-foreground",
                    errors.departureDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "dd/MM/yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-white">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  locale={fr}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
          </div>

          <div>
            <Label htmlFor="departureTime" className="text-navy">Heure de départ*</Label>
            <Input
              id="departureTime"
              name="departureTime"
              type="time"
              value={formData.departureTime}
              onChange={handleInputChange}
              className={cn("bg-white text-gray-900", errors.departureTime && "border-red-500")}
            />
            {errors.departureTime && <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-navy">Date de retour*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left text-gray-900 font-normal bg-white hover:bg-gray-50",
                    !returnDate && "text-muted-foreground",
                    errors.returnDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "dd/MM/yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-white">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  locale={fr}
                  disabled={(date) => date < (departureDate || new Date())}
                />
              </PopoverContent>
            </Popover>
            {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
          </div>

          <div>
            <Label htmlFor="returnTime" className="text-navy">Heure de retour*</Label>
            <Input
              id="returnTime"
              name="returnTime"
              type="time"
              value={formData.returnTime}
              onChange={handleInputChange}
              className={cn("bg-white text-gray-900", errors.returnTime && "border-red-500")}
            />
            {errors.returnTime && <p className="text-red-500 text-sm mt-1">{errors.returnTime}</p>}
          </div>
        </div>

        {/* Estimation */}
        {isFormComplete && (
        <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mt-6">
            <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Estimation de prix</p>
            <div className="text-3xl font-bold text-gold mb-2">
                {apiEstimation
                ? `À partir de ${apiEstimation.montantFinal}€`
                : `À partir de ${estimatedPrice}€`
                }
            </div>
            <p className="text-xs text-gray-500">
                {apiEstimation
                ? `Pour ${apiEstimation.nombreJours} jour${apiEstimation.nombreJours > 1 ? "s" : ""} • Prix final selon services choisis`
                : `Pour ${days} jour${days > 1 ? "s" : ""} • Prix final selon services choisis`
                }
            </p>
            </div>
        </div>
        )}


        <div className="mt-6 text-center">
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!isFormComplete}
            className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 px-8 text-lg"
          >
            Continuer ma réservation
          </Button>
          <p className="text-sm text-gray-500 mt-2">* Champs obligatoires</p>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
