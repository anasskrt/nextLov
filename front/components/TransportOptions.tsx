import { Car, Users, Plane, Clock, Shield, Star, MapPin, CheckCircle } from "lucide-react";

const TransportOptions = () => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mb-12 border border-primary/10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Texte à gauche */}
        <div>
          <h3 className="text-3xl font-bold text-navy mb-6">
            Deux Solutions de Transport Adaptées
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Optez pour la tranquillité avec nos solutions pratiques et confortables pour vos déplacements vers l&apos;aéroport de Bordeaux-Mérignac.
          </p>
          
          {/* Voiturier */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-navy">Service Voiturier</h4>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Gagnez du temps avec notre <strong>service voiturier</strong>. Nous prenons en charge votre véhicule directement sur le parking de l&apos;aéroport de Bordeaux-Mérignac après un état des lieux minutieux. À votre retour, votre voiture vous attend sur place, prête à partir immédiatement.
            </p>
            <div className="flex items-center gap-4 text-sm text-gold">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Confort maximal
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Prise en charge immédiate
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Gain de temps
              </span>
            </div>
          </div>

          {/* Navette - Indisponible temporairement */}
          <div className="relative">
            {/* Overlay avec badge "Disponible prochainement" */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-sm flex items-center gap-2 animate-pulse">
                <Clock className="h-4 w-4" />
                Disponible prochainement
              </div>
            </div>
            
            {/* Contenu grisé */}
            <div className="opacity-60 grayscale pointer-events-none">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-navy">Service Navette</h4>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Déposez votre véhicule directement sur notre parking sécurisé à seulement <strong>7 min de l&apos;aéroport</strong>. Après un état des lieux détaillé, notre navette vous conduit au terminal. À votre retour, contactez-nous après avoir récupéré vos bagages : nous vous récupérerons rapidement pour vous restituer votre voiture.
              </p>
              <div className="flex items-center gap-4 text-sm text-primary-red-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  7 min de trajet
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Véhicule sécurisé
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Simple et économique
                </span>
              </div>
            </div>
            
            {/* Message d'information */}
            <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
              <p className="text-sm text-orange-800 font-medium">
                ℹ️ Ce service sera bientôt disponible. En attendant, profitez de notre service voiturier !
              </p>
            </div>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            Pour plus d&apos;informations sur les modalités de chaque service, consultez notre <a href="/faq" className="text-primary underline">FAQ détaillée</a>.
          </p>
        </div>
        
        {/* Image à droite */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center text-white">
                <Plane className="h-20 w-20 mx-auto mb-4" />
                <p className="text-xl font-bold mb-2">Bordeaux-Mérignac</p>
                <p className="text-lg">Aéroport</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-xl">
              <div className="text-center text-white">
                <Users className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs font-bold">24/7</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-navy rounded-full flex items-center justify-center shadow-lg">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportOptions;
