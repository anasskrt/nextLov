/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

interface UserInfo {
  name: string;
  firstName: string;
  email: string;
  phone: string;
  carModel: string;
  carYear: string;
  carLicensePlate: string;
  selectedTransport?: string;
}

interface UserInfoFormProps {
  onNext: (userInfo: UserInfo) => void;
  onBack: () => void;
}

const UserInfoForm = ({ onNext, onBack }: UserInfoFormProps) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: "",
    firstName: "",
    email: "",
    phone: "",
    carModel: "",
    carYear: "",
    carLicensePlate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transports, setTransports] = useState<any[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [transportError, setTransportError] = useState<string | null>(null);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.carModel.trim()) newErrors.carModel = "Le modèle de voiture est requis";
    if (!formData.carYear.trim()) newErrors.carYear = "L'année du véhicule est requise";
    if (!formData.carLicensePlate.trim()) newErrors.carLicensePlate = "La plaque d'immatriculation est requise";
    if (!selectedTransport) newErrors.transport = "Le mode de transport est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ ...formData, selectedTransport: selectedTransport || "" });    
    }
  };

    useEffect(() => {
    const fetchTransports = async () => {
      try {
        const res = await fetch("/api/transports");
        if (!res.ok) throw new Error("Erreur de récupération des transports");
        const data = await res.json();
        setTransports(data.filter((t: any) => t.actif === true));       
      } catch {
        setTransportError("Erreur lors du chargement des modes de transport");
      }
    };
    fetchTransports();
  }, []);


  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-navy">Vos informations</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-navy">Nom*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={cn(
                  "bg-white",
                  errors.name && "border-red-500"
                )}
                placeholder="Votre nom"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="firstName" className="text-navy">Prénom*</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={cn(
                  "bg-white",
                  errors.firstName && "border-red-500"
                )}
                placeholder="Votre prénom"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="phone" className="text-navy">Téléphone*</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={cn(
                  "bg-white",
                  errors.phone && "border-red-500"
                )}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-navy">Email*</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={cn(
                  "bg-white",
                  errors.email && "border-red-500"
                )}
                placeholder="Votre email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Informations du véhicule */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4">Informations du véhicule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carModel" className="text-navy">Modèle de voiture*</Label>
              <Input
                id="carModel"
                name="carModel"
                value={formData.carModel}
                onChange={handleInputChange}
                className={cn(
                  "bg-white",
                  errors.carModel && "border-red-500"
                )}
                placeholder="Ex: BMW Série 3, Mercedes Classe C..."
              />
              {errors.carModel && <p className="text-red-500 text-sm mt-1">{errors.carModel}</p>}
            </div>

            <div>
              <Label htmlFor="carYear" className="text-navy">Année du véhicule*</Label>
              <Input
                id="carYear"
                name="carYear"
                value={formData.carYear}
                onChange={handleInputChange}
                className={cn(
                  "bg-white",
                  errors.carYear && "border-red-500"
                )}
                placeholder="Ex: 2020"
              />
              {errors.carYear && <p className="text-red-500 text-sm mt-1">{errors.carYear}</p>}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="carLicensePlate" className="text-navy">Plaque d&apos;immatriculation*</Label>
            <Input
              id="carLicensePlate"
              name="carLicensePlate"
              value={formData.carLicensePlate}
              onChange={handleInputChange}
              className={cn(
                "bg-white",
                errors.carLicensePlate && "border-red-500"
              )}
              placeholder="Ex: AB-123-CD"
            />
            {errors.carLicensePlate && <p className="text-red-500 text-sm mt-1">{errors.carLicensePlate}</p>}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-navy mb-4">Mode de transport*</h3>
            {transportError && <div className="text-red-500 mb-2">{transportError}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transports.map((transport) => (
                <Card
                  key={transport.id}
                  className={cn(
                    "cursor-pointer border-2 transition-all",
                    selectedTransport && selectedTransport.id === transport.id
                      ? "border-gold ring-2 ring-gold"
                      : "border-gray-200 hover:border-gold",
                    errors.transport && "border-red-500"
                  )}
                  onClick={() => {
                    setSelectedTransport(transport);
                    if (errors.transport) {
                      setErrors((prev) => ({
                        ...prev,
                        transport: "",
                      }));
                    }
                  }}
                >
                  <div className="p-4 flex flex-col h-full justify-between">
                    <div>
                      <CardTitle className="text-navy text-lg mb-2">{transport.type}</CardTitle>
                      <CardDescription className="mb-2">{transport.consignes}</CardDescription>
                    </div>
                    <div className="text-xl font-bold text-gold mt-2">{transport.prix}€</div>
                  </div>
                </Card>
              ))}
            </div>
            {errors.transport && <p className="text-red-500 text-sm mt-2">{errors.transport}</p>}
          </div>
        </div>
      
        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button 
            type="submit"
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-8"
          >
            Continuer vers les règles
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;
