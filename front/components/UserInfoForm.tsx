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
  carColor: string;
  carMarque: string;
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
    carColor: "",
    carMarque: "",
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
    if (!formData.carMarque.trim()) newErrors.carMarque = "La marque du véhicule est requise";
    if (!formData.carColor.trim()) newErrors.carColor = "La couleur du véhicule est requise";
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
        // Afficher tous les transports (actifs et inactifs)
        setTransports(data);       
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
                type="tel"
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
                placeholder="Ex: Clio, 208, Golf..."
              />
              {errors.carModel && <p className="text-red-500 text-sm mt-1">{errors.carModel}</p>}
            </div>

            <div>
              <Label htmlFor="carMarque" className="text-navy">Marque du véhicule*</Label>
              <Input
                id="carMarque"
                name="carMarque"
                value={formData.carMarque}
                onChange={handleInputChange}
                className={cn(
                  "bg-white",
                  errors.carMarque && "border-red-500"
                )}
                placeholder="Ex: BMW, Mercedes, Audi..."
              />
              {errors.carMarque && <p className="text-red-500 text-sm mt-1">{errors.carMarque}</p>}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="carColor" className="text-navy">Couleur du véhicule*</Label>
            <Input
              id="carColor"
              name="carColor"
              value={formData.carColor}
              onChange={handleInputChange}
              className={cn(
                "bg-white",
                errors.carColor && "border-red-500"
              )}
              placeholder="Ex: Rouge, Bleu, Noir..."
            />
            {errors.carColor && <p className="text-red-500 text-sm mt-1">{errors.carColor}</p>}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-navy mb-4">Mode de transport*</h3>
            {transportError && <div className="text-red-500 mb-2">{transportError}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transports.map((transport) => {
                const isInactive = !transport.actif;
                return (
                  <Card
                    key={transport.id}
                    className={cn(
                      "border-2 transition-all relative",
                      isInactive 
                        ? "cursor-not-allowed opacity-60 bg-gray-100" 
                        : "cursor-pointer",
                      !isInactive && selectedTransport && selectedTransport.id === transport.id
                        ? "border-gold ring-2 ring-gold"
                        : "border-gray-200",
                      !isInactive && "hover:border-gold",
                      errors.transport && !isInactive && "border-red-500"
                    )}
                    onClick={() => {
                      if (!isInactive) {
                        setSelectedTransport(transport);
                        if (errors.transport) {
                          setErrors((prev) => ({
                            ...prev,
                            transport: "",
                          }));
                        }
                      }
                    }}
                  >
                    <div className="p-4 flex flex-col h-full justify-between">
                      {isInactive && (
                        <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          Indisponible
                        </div>
                      )}
                      <div>
                        <CardTitle className={cn(
                          "text-lg mb-2",
                          isInactive ? "text-gray-500" : "text-navy"
                        )}>
                          {transport.type}
                        </CardTitle>
                        <CardDescription className={cn(
                          "mb-2",
                          isInactive && "text-gray-400"
                        )}>
                          {isInactive ? "Disponible prochainement" : transport.consignes}
                        </CardDescription>
                      </div>
                      <div className={cn(
                        "text-right font-bold text-lg",
                        isInactive ? "text-gray-400" : "text-gold"
                      )}>
                      </div>
                    </div>
                  </Card>
                );
              })}
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
