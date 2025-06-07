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
import { Check } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  included: string[];
}

interface ServiceSelectionProps {
  onNext: (selectedServices: Service[], totalPrice: number) => void;
  onBack: () => void;
}

const ServiceSelection = ({ onNext, onBack }: ServiceSelectionProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services: Service[] = [
    {
      id: "basic",
      name: "Service Basique",
      description: "Gardiennage simple de votre véhicule",
      price: 25,
      included: [
        "Parking sécurisé 24h/24",
        "Récupération et livraison",
        "Surveillance vidéo",
        "Assurance incluse",
      ],
    },
    {
      id: "premium",
      name: "Service Premium",
      description: "Service complet avec options supplémentaires",
      price: 45,
      included: [
        "Tout du service basique",
        "Nettoyage extérieur",
        "Vérification des fluides",
        "Photos avant/après",
        "Service prioritaire",
      ],
    },
    {
      id: "luxury",
      name: "Service Luxe",
      description: "Le summum du service pour véhicules haut de gamme",
      price: 75,
      included: [
        "Tout du service premium",
        "Nettoyage intérieur complet",
        "Maintenance préventive",
        "Voiturier dédié",
        "Rapport détaillé",
        "Service de conciergerie",
      ],
    },
  ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    const selected = services.filter((service) =>
      selectedServices.includes(service.id)
    );
    const totalPrice = selected.reduce((sum, service) => sum + service.price, 0);
    onNext(selected, totalPrice);
  };

  const isServiceSelected = (serviceId: string) =>
    selectedServices.includes(serviceId);

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-navy">Choisissez vos services</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isServiceSelected(service.id)
                ? "ring-2 ring-gold border-gold"
                : "border-gray-200 hover:border-gold"
            }`}
            onClick={() => handleServiceToggle(service.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-navy">{service.name}</CardTitle>
                {isServiceSelected(service.id) && (
                  <div className="bg-gold rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold mb-4">
                {service.price}€<span className="text-sm text-gray-500"></span>
              </div>
              <ul className="space-y-2">
                {service.included.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <div className="text-center">
          {selectedServices.length > 0 && (
            <div className="text-lg font-semibold text-navy mb-2">
              Total sélectionné:{" "}
              {services
                .filter((s) => selectedServices.includes(s.id))
                .reduce((sum, s) => sum + s.price, 0)}
              €
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={selectedServices.length === 0}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-8"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
