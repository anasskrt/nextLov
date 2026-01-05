/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  const [voiturierTransport, setVoiturierTransport] = useState<any>(null);

  // 🔄 Récupérer automatiquement les infos du transport voiturier
  useEffect(() => {
    const fetchVoiturier = async () => {
      try {
        const res = await fetch("/api/transports");
        if (!res.ok) return;
        const transports = await res.json();
        // Chercher le transport de type "voiturier"
        const voiturier = transports.find((t: any) => 
          t.type?.toLowerCase().includes("voiturier") || 
          t.type?.toLowerCase().includes("valet")
        );
        if (voiturier) {
          setVoiturierTransport(voiturier);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du transport voiturier:', error);
      }
    };
    fetchVoiturier();
  }, []);

  // 🚀 Auto-save dès que email + phone + firstName sont remplis
  useEffect(() => {
    const saveAbandonment = async () => {
      // Vérifier que les 3 champs essentiels sont remplis
      if (!formData.email || !formData.phone || !formData.firstName) {
        return;
      }

      // Vérifier que l'email est valide
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        return;
      }

      // Vérifier que le téléphone a au moins 10 chiffres
      if (formData.phone.replace(/\D/g, '').length < 10) {
        return;
      }

      try {
        // Récupérer les bookingDetails depuis sessionStorage
        const stored = sessionStorage.getItem('bookingDetails');
        let bookingDetails = null;
        if (stored) {
          bookingDetails = JSON.parse(stored);
        }

        const dataToSend = {
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.name || null,
          estimatedPrice: bookingDetails?.estimation?.montantFinal || null,
          departureDate: bookingDetails?.fullDepartureDate || null,
          returnDate: bookingDetails?.fullReturnDate || null,
          currentStep: 'userinfo',
          selectedServices: [],
          abandonedAt: new Date().toISOString(),
        };


        await fetch('/api/booking/abandonments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      } catch (error) {
        // Silent fail - on ne veut pas embêter l'utilisateur
        console.error('Erreur auto-save:', error);
      }
    };

    // Debounce de 2 secondes pour éviter trop de requêtes
    const timer = setTimeout(() => {
      saveAbandonment();
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData.email, formData.phone, formData.firstName, formData.name]);

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Toujours envoyer le transport voiturier complet avec toutes ses informations
      onNext({ 
        ...formData, 
        selectedTransport: voiturierTransport || "voiturier" 
      });    
    }
  };




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
