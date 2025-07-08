import { Car, Plane, Users, ArrowRight, Clock, MapPin, Shield, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TransportOptions from "./TransportOptions";

const HowItWorks = () => {
  const steps = [
    {
      icon: Car,
      title: "Déposez votre véhicule",
      subtitle: "Service voiturier Premium",
      description: "Déposez votre véhicule facilement au dépose-minute avec notre voiturier à l'aéroport Bordeaux-Mérignac, ou rendez-vous directement dans notre parking sécurisé MSParking situé à Bordeaux-Pessac. Notre équipe de professionnels vous accueille chaleureusement 24h/24.",
      features: ["Parking privé sécurisé", "Accueil personnalisé 24h/24", "Assurance incluse"]
    },
    {
      icon: Users,
      title: "Transport rapide vers l'aéroport",
      subtitle: "Navette incluse",
      description: "Profitez de notre navette et rapide, qui vous conduit en moins de 7 minutes vers l'aéroport Bordeaux-Mérignac. Transport confortable et climatisé pour garantir votre ponctualité.",
      features: ["Navette rapide (7 min)", "Véhicule climatisé", "Ponctualité garantie"]
    },
    {
      icon: Plane,
      title: "Voyagez en toute tranquillité",
      subtitle: "Parking surveillé 24h/24",
      description: "Votre véhicule est surveillé en permanence avec caméras HD, éclairage nocturne puissant et patrouilles régulières. Nous assurons un gardiennage optimal et sécurisé tout au long de votre voyage.",
      features: ["Surveillance caméra 24h/24", "Éclairage nocturne renforcé", "Patrouilles fréquentes"]
    },
    {
      icon: ArrowRight,
      title: "Récupération facile du véhicule",
      subtitle: "Retour rapide et pratique",
      description: "Avec le service voiturier, votre voiture vous attend directement à l'aéroport Bordeaux-Mérignac. Avec la navette, retrouvez facilement notre équipe grâce à une carte interactive fournie lors du dépôt. Votre véhicule vous sera restitué en parfait état.",
      features: ["Récupération rapide", "Communication facilitée", "Véhicule prêt et sécurisé"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Gardiennage Voiturier Bordeaux-Mérignac
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
            Comment fonctionne notre service de 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> gardiennage automobile à Bordeaux-Mérignac</span> ?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            MSParking offre un <strong>service de gardiennage automobile et voiturier premium</strong> à l'aéroport Bordeaux-Mérignac. Profitez d'un stationnement sécurisé, d'une navette et d'une surveillance constante pour voyager sereinement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-primary" /> Service 24h/24, 7j/7
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-primary" /> Bordeaux-Mérignac
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-primary" /> Parking sécurisé
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-primary" /> Satisfaction garantie
            </div>
          </div>
        </div>
        <TransportOptions />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
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
      </div>
    </section>
  );
};

export default HowItWorks;
