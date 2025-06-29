import BookingForm from "@/components/BookingForm";

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('/hero.webp')" }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Gardiennage de Voitures aéroport de Bordeaux.
            </h1>
            <p className="text-lg sm:text-xl mb-8">
              Confiez-nous votre véhicule : nous vous déposons en navette gratuitement et en toute sérénité à l&apos;aéroport de Bordeaux. Votre voiture vous attendra dans notre parking sécurisé situé à seulement 7 minutes de l&apos;aéroport.
            </p>
            <div className="mt-2 text-sm text-yellow-200 bg-yellow-900/60 rounded px-3 py-2 max-w-md">
              <strong>Notice :</strong> L&apos;heure d&apos;aller doit être prévue au moins <b>45 minutes avant la fin de l&apos;enregistrement à l&apos;aéroport</b> pour garantir la prise en charge de votre véhicule dans les meilleures conditions.
            </div>
            <div className="mt-2 text-sm text-yellow-200 bg-yellow-900/60 rounded px-3 py-2 max-w-md">
              <strong>Information :</strong> Pour toutes les heures d&apos;arrivée et de retour prévues entre 22h et 6h, des frais supplémentaires sont ajoutés.
            </div>
          </div>

          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;
