import { Button } from "@/components/ui/button";

const MarketingSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-navy mb-8 leading-tight">
            MSParking, votre parking sécurisé
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> au meilleur prix à Bordeaux</span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-2xl text-gray-700 leading-relaxed">
              Simplifiez vos déplacements à l'aéroport de Bordeaux-Mérignac avec un service de gardiennage automobile professionnel, fiable et économique. Avec MSParking, votre voiture est entre de bonnes mains.
            </p>

            <p className="text-xl text-gray-600 leading-relaxed">
              <strong>Voyagez en toute sérénité !</strong> Pendant votre absence, votre véhicule est surveillé 24h/24 dans notre parking sécurisé à seulement 7 min de l'aéroport. Notre équipe expérimentée assure une vigilance constante pour votre tranquillité d'esprit.
            </p>

            <p className="text-xl text-gray-600 leading-relaxed">
              Choisissez entre notre navette rapide ou notre service voiturier premium selon vos besoins. Plus besoin de chercher une place ou de vous inquiéter pour votre voiture : avec MSParking, partez l'esprit léger et revenez sereinement.
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12 mt-16 border border-primary/20">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-navy mb-6">
                Une expérience parking adaptée à vos besoins
              </h3>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Profitez d’un service complet : gardiennage sécurisé, navette rapide, voiturier personnalisé, disponibilité permanente et tarifs attractifs. MSParking transforme votre trajet vers l'aéroport en une expérience agréable et sans stress.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold px-8 py-3"
                >
                  Réservez votre place
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 px-8 py-3"
                >
                  Nos services en détail
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;