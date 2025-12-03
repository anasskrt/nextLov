import { Wrench, Phone, Mail, CheckCircle, Clock, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const GarageService = () => {
  const services = [
    {
      icon: Wrench,
      title: "Révision complète",
      description: "Vidange, filtres, contrôle des niveaux et points de sécurité",
    },
    {
      icon: CheckCircle,
      title: "Petite mécanique",
      description: "Remplacement plaquettes, disques, courroies et entretien courant",
    },
    {
      icon: Shield,
      title: "Contrôle technique",
      description: "Préparation et passage du contrôle technique",
    },
    {
      icon: Clock,
      title: "Intervention rapide",
      description: "Prise en charge pendant votre absence, véhicule prêt à votre retour",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Titre de la section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6 border border-gold/20">
            <Wrench className="h-4 w-4" />
            Service exclusif partenaire
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
            Service Garage Professionnel
            <br />
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Pendant votre voyage
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            MSParking est affilié à un garage professionnel. Profitez de votre voyage pour faire 
            entretenir ou réparer votre véhicule en toute sérénité.
          </p>
        </div>

        {/* Alerte information */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Comment ça fonctionne ?</h3>
                <p className="text-blue-800 mb-3">
                  Pendant que votre véhicule est garé chez MSParking, notre garage partenaire peut 
                  effectuer une révision, un entretien ou une petite réparation mécanique. 
                  Votre voiture sera prête et en parfait état à votre retour !
                </p>
                <p className="text-sm text-blue-700 italic">
                  ⏱️ Délai minimum : 48h de stationnement recommandé pour les interventions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7 text-gold" />
                </div>
                <CardTitle className="text-lg text-navy">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Carte de contact du garage */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-navy to-navy-light text-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
            <CardHeader className="relative pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-gold" />
                </div>
                Contactez notre garage partenaire
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <p className="text-white/90 text-lg">
                Pour toute demande d&apos;intervention mécanique pendant votre séjour, 
                contactez directement notre garage partenaire agréé.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Téléphone */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Par téléphone</h4>
                      <a 
                        href="tel:+33609041879" 
                        className="text-xl font-bold text-gold hover:text-gold-light transition-colors"
                      >
                        06 09 04 18 79
                      </a>
                      <p className="text-sm text-white/70 mt-1">Lundi - Samedi : 8h - 19h</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Par email</h4>
                      <a 
                        href="mailto:contact@msparking.fr" 
                        className="text-lg font-bold text-gold hover:text-gold-light transition-colors break-all"
                      >
                        contact@msparking.fr
                      </a>
                      <p className="text-sm text-white/70 mt-1">Réponse sous 24h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points importants */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-gold" />
                  Points importants
                </h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Devis gratuit sur demande avant toute intervention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Pièces de qualité et garanties constructeur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Facturation transparente, aucune surprise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Votre véhicule reste assuré pendant toute la durée des travaux</span>
                  </li>
                </ul>
              </div>

              {/* Bouton d'action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  asChild
                  className="bg-gold hover:bg-gold-light text-navy font-bold flex-1"
                  size="lg"
                >
                  <a href="tel:+33609041879">
                    <Phone className="mr-2 h-5 w-5" />
                    Appeler maintenant
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 flex-1"
                  size="lg"
                >
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note de bas de page */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 italic">
            * Service optionnel en partenariat avec un garage agréé. Les tarifs sont communiqués sur devis.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GarageService;
