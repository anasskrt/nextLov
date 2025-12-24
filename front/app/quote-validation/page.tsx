/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, CarFront, Mail, Phone, User } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CarInformation, SimplifiedQuoteData } from "@/lib/types";

const QuoteValidationPage = () => {
  const router = useRouter();

  const [quoteData, setQuoteData] = useState<SimplifiedQuoteData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState<CarInformation>({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
  });

  useEffect(() => {
    const sessionQuote = sessionStorage.getItem("pendingQuoteValidation");
    if (!sessionQuote) {
      toast.error("Aucun devis à valider. Veuillez d'abord créer un devis.");
      router.push("/");
      return;
    }

    const parsed = JSON.parse(sessionQuote);
    setQuoteData(parsed);
  }, [router]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const storedName = localStorage.getItem("userName") || "";
      const storedEmail = localStorage.getItem("userEmail") || "";
      setName(storedName);
      setEmail(storedEmail);
    }
  }, []);

  const handleCarInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !car.make || !car.model || !car.year || !car.licensePlate) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    toast.success("Votre demande a été enregistrée avec succès.");
    router.push(`/?validationComplete=true&email=${encodeURIComponent(email)}`);
  };

  const handleLogin = () => {
    sessionStorage.setItem("pendingQuoteValidation", JSON.stringify(quoteData));
    router.push("/connexion");
  };

  const handleSignup = () => {
    sessionStorage.setItem("pendingQuoteValidation", JSON.stringify(quoteData));
    router.push("/signup");
  };

  if (!quoteData) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow page-container py-8 pt-20">
        <h1 className="section-heading text-center mb-6">Validation de votre devis</h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-navy text-white">
            <CardTitle>Finaliser votre demande</CardTitle>
            <CardDescription className="text-gray-200">
              Complétez les informations ci-dessous pour confirmer votre demande de service voiturier
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6 space-y-6">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-2 text-navy">Détails du devis</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-navy" />
                  <span>Départ: {format(new Date(quoteData.departureDate), "dd/MM/yyyy", { locale: fr })} à {quoteData.departureTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-navy" />
                  <span>Retour: {format(new Date(quoteData.returnDate), "dd/MM/yyyy", { locale: fr })} à {quoteData.returnTime}</span>
                </div>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium mb-2 text-navy">Connexion rapide</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleLogin}>Se connecter</Button>
                  <Button className="flex-1 bg-gold hover:bg-gold-dark text-navy" onClick={handleSignup}>Créer un compte</Button>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm text-gray-500">ou continuez en tant qu&apos;invité</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 text-navy">Vos coordonnées</h4>
                <div className="space-y-3">
                  <InputField label="Nom complet*" icon={User} value={name} onChange={setName} disabled={isLoggedIn} />
                  <InputField label="Email*" icon={Mail} value={email} onChange={setEmail} type="email" disabled={isLoggedIn} />
                  <InputField label="Téléphone*" icon={Phone} value={phone} onChange={setPhone} />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-navy">Informations du véhicule</h4>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Marque*" icon={CarFront} name="make" value={car.make} onChange={handleCarInfoChange} />
                  <InputField label="Modèle*" name="model" value={car.model} onChange={handleCarInfoChange} />
                  <InputField label="Année*" name="year" value={car.year} onChange={handleCarInfoChange} />
                  <InputField label="Immatriculation*" name="licensePlate" value={car.licensePlate} onChange={handleCarInfoChange} />
                </div>
              </div>

              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end px-0">
                <Button type="button" variant="outline" onClick={() => router.push("/")}>Retour</Button>
                <Button type="submit" className="bg-navy hover:bg-navy-light">Valider le devis</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteValidationPage;

const InputField = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  icon?: any;
  name?: string;
  value: string;
  onChange: any;
  type?: string;
  disabled?: boolean;
}) => (
  <div className="grid grid-cols-1 gap-2">
    <Label>{label}</Label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />}
      <Input
        name={name}
        type={type}
        className={Icon ? "pl-10" : ""}
        value={value}
        onChange={(e: any) => (name ? onChange(e) : onChange(e.target.value))}
        disabled={disabled}
        required
      />
    </div>
  </div>
);
