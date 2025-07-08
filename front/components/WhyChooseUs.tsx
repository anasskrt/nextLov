import { Shield, Clock, Award, HeartHandshake, Camera, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WhyChooseUs = () => {
  const advantages = [
    {
      icon: Shield,
      title: "Sécurité maximale",
      description: "Parking surveillé 24h/24, accès contrôlé et équipe sur place.",
    },
    {
      icon: Clock,
      title: "Disponible 24h/24",
      description: "Service voiturier et gardiennage accessible à tout moment.",
    },
    {
      icon: Award,
      title: "Professionnalisme",
      description: "10 ans d'expérience, équipe qualifiée et accueil attentionné.",
    },
    {
      icon: HeartHandshake,
      title: "Prise en charge personnalisée",
      description: "Accompagnement sur mesure et suivi du véhicule.",
    },
    {
      icon: Camera,
      title: "Transparence",
      description: "Photos à l'arrivée et au départ pour une confiance totale.",
    },
    {
      icon: Wrench,
      title: "Services pratiques",
      description: "Lavage, entretien, petits contrôles pendant votre absence.",
    },
  ];

  return (
    <section className="py-16 bg-navy text-white" id="why-choose-us">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir MSParking&nbsp;?
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Voyagez l’esprit tranquille grâce à notre service voiturier et parking sécurisé à Bordeaux-Mérignac. Découvrez les garanties qui font la différence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <Card key={index} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                  <advantage.icon className="h-8 w-8 text-gold" />
                </div>
                <CardTitle className="text-xl text-white">{advantage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-center">{advantage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gold/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Notre engagement</h3>
          <p className="text-lg opacity-90 mb-6">
            Plus de 15&nbsp;000 clients nous ont déjà fait confiance pour la simplicité, la sécurité et la qualité de notre service à l'aéroport de Bordeaux. 
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-gold mb-2">10+</div>
              <div className="text-sm">Années d'expérience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold mb-2">15000+</div>
              <div className="text-sm">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold mb-2">99.8%</div>
              <div className="text-sm">Taux de satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold mb-2">0</div>
              <div className="text-sm">Incident sécurité</div>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-base font-semibold">
              Réservez facilement votre parking en ligne et profitez d’un service sans stress à chaque voyage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
