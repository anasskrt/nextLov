import { Car, Plane, Users, ArrowRight, Clock, MapPin, Shield, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TransportOptions from "./TransportOptions";

const HowItWorks = () => {
  const mainSteps = [
    {
      icon: Car,
      title: "1. Déposez votre véhicule au dépose-minute",
      subtitle: "Prise en charge directe à l'aéroport",
      description: "Rendez-vous directement au dépose-minute de l'aéroport de Bordeaux-Mérignac. Notre voiturier vous accueille 24h/24, réalise un état des lieux complet de votre véhicule et vous remet un reçu.",
      features: ["Accueil 24h/24 et 7j/7", "État des lieux détaillé", "Prise en charge immédiate"]
    },
    {
      icon: Plane,
      title: "2. Partez l'esprit tranquille",
      subtitle: "Nous prenons soin de votre véhicule",
      description: "Dès votre départ, nous transférons votre voiture vers notre parking privé sécurisé. Pendant toute la durée de votre voyage, votre véhicule est gardé sous surveillance vidéo continue.",
      features: ["Parking sécurisé privé", "Surveillance 24h/24", "Vol retour enregistré"]
    }
  ];

  const finalStep = {
    icon: ArrowRight,
    title: "3. Récupérez votre voiture au dépose-minute",
    subtitle: "Restitution automatique et sécurisée",
    description: "Grâce aux informations de votre vol retour, nous préparons votre véhicule en avance. À votre arrivée au dépose-minute, votre voiture vous attend. Vérification rapide de l'état, signature, et vous repartez immédiatement !",
    features: ["Préparation anticipée", "Restitution au dépose-minute", "Contrôle final ensemble", "Départ immédiat"]
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
            Comment fonctionne notre 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Service Voiturier ?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Un service <strong>simple, rapide et sécurisé</strong> : nous récupérons votre véhicule directement au dépose-minute de l&apos;aéroport et vous le restituons au même endroit à votre retour. Aucun déplacement, aucun stress !
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Car className="h-4 w-4 text-primary" /> Service Voiturier Premium
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-primary" /> Disponible 24h/24, 7j/7
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-primary" /> Dépose-minute aéroport
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-primary" /> Parking sécurisé
            </div>
          </div>
        </div>
        <TransportOptions />

        {/* Les 2 premières étapes en grille 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {mainSteps.map((step, index) => (
            <Card key={index} className="group hover:shadow-xl transition duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full text-xs font-bold text-white flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-navy group-hover:text-primary transition-colors">
                      {step.title}
                    </CardTitle>
                    <p className="text-sm text-secondary font-medium">{step.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Étape finale centrée */}
        <div className="flex justify-center">
          <Card className="group hover:shadow-xl transition duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-2 max-w-2xl w-full">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                    <finalStep.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full text-xs font-bold text-white flex items-center justify-center">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl text-navy group-hover:text-primary transition-colors">
                    {finalStep.title}
                  </CardTitle>
                  <p className="text-sm text-secondary font-medium">{finalStep.subtitle}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 mb-4">{finalStep.description}</p>
              <div className="flex flex-wrap gap-2">
                {finalStep.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
