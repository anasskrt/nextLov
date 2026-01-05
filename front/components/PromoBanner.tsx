import { Sparkles } from "lucide-react";

const PromoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-navy via-navy-light to-navy py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
            <span className="text-white font-bold text-lg sm:text-xl">
              Offre de Lancement !
            </span>
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          </div>
          <div className="text-white text-base sm:text-lg">
            Profitez du gardiennage à seulement{" "}
            <span className="text-gold font-extrabold text-xl sm:text-2xl">7€/jour</span>
            {" "}pendant la période de lancement
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
