"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Service {
  id: string | number; // int ou string selon ta DB/Prisma
  name: string;
  description: string;
  price: number | string;
  included: string[];
}

interface ServiceSelectionProps {
  onNext: (selectedServices: Service[]) => void;
  onBack: () => void;
}

const ServiceSelection = ({ onNext, onBack }: ServiceSelectionProps) => {
  const [selectedServices, setSelectedServices] = useState<{ id: string | number; price: number | string }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/service");
        if (!res.ok) throw new Error("Erreur de récupération des services");
        const data = await res.json();
        setServices(data);
        setLoading(false);
      } catch {
        setError("Erreur");
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServiceToggle = (serviceId: string | number, servicePrice: number | string) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === serviceId);
      if (exists) {
        return prev.filter(s => s.id !== serviceId);
      } else {
        return [...prev, { id: serviceId, price: servicePrice }];
      }
    });
  };

  const handleNext = () => {
    const selected = services.filter(service => selectedServices.some(sel => sel.id === service.id));
    onNext(selected);
  };

  const isServiceSelected = (serviceId: string | number) =>
    selectedServices.some(s => s.id === serviceId);

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => {
      if (typeof s.price === "number") {
        return sum + s.price;
      }
      return sum;
    }, 0);
  };

  const hasQuoteService = selectedServices.some(s => typeof s.price === "string");

  // Render loading/error
  if (loading) return <div>Chargement des services...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-navy">Services optionnels</h2>
      <p className="mb-6 italic text-gray-500">Veuillez sélectionner les services optionnels que vous souhaitez ajouter à votre réservation.</p>
      <div className="flex flex-col space-y-4 mb-6">
        {services.map((service) => (
          <Card 
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isServiceSelected(service.id)
                ? 'ring-2 ring-gold border-gold'
                : 'border-gray-200 hover:border-gold'
            }`}
            onClick={() => handleServiceToggle(service.id, service.price)}
          >
            <div className="flex items-start p-4">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-lg text-navy">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xl font-bold text-gold">
                      {typeof service.price === "number" ? `${service.price}€` : service.price}
                    </div>
                    {isServiceSelected(service.id) && (
                      <div className="bg-gold rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-2 mt-3">
                  {service.included.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
              {calculateTotal() > 0 && (
                <span>Total: {calculateTotal()}€</span>
              )}
              {hasQuoteService && calculateTotal() > 0 && <span> + services sur devis</span>}
              {hasQuoteService && calculateTotal() === 0 && <span>Services sur devis sélectionnés</span>}
            </div>
          )}
          <Button 
            onClick={handleNext}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-8"
          >
            {selectedServices.length === 0 ? "Continuer sans services" : "Continuer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
