import BookingForm from "@/components/BookingForm";

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('/hero.png')" }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Service de Gardiennage de Voitures Premium avec Voiturier
            </h1>
            <p className="text-lg sm:text-xl mb-8">
              Confiez-nous votre véhicule en toute sérénité. Notre équipe de voituriers professionnels prend soin de votre voiture pendant que vous voyagez.
            </p>
          </div>

          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;
