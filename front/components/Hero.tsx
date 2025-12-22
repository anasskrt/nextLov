import BookingForm from "@/components/BookingForm";

// Dans /app/page.tsx
export const metadata = {
  title: "MsParking - Parking Aéroport Bordeaux Mérignac | Voiturier & Navette Sécurisés",
  description: "Parking sécurisé à 7 min de l'aéroport de Bordeaux-Mérignac. Service voiturier premium ou navette gratuite 24h/24. Réservation en ligne dès 10€/jour.",
  keywords: "parking aéroport Bordeaux, parking Bordeaux Mérignac, voiturier aéroport Bordeaux, navette aéroport, parking sécurisé Bordeaux, parking pas cher Bordeaux, gardiennage automobile Bordeaux",
  alternates: {
    canonical: "https://msparking.fr/",
  },
};

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
            Votre Parking Sécurisé à 7 min de l'Aéroport
          </h1>

          <p className="text-lg sm:text-xl mb-8">
            Partez l'esprit tranquille avec <strong>MSParking</strong>. 
            Profitez de notre <strong>service voiturier 24h/7h</strong>. Votre véhicule est gardé dans 
            notre parking privé et surveillé pendant que vous voyagez.
          </p>

          <div className="mt-2 text-sm text-yellow-200 bg-yellow-900/60 rounded px-3 py-2 max-w-md">
            <strong>Notice :</strong> Pour la navette, prévoyez votre arrivée au
            parking au moins <b>45 minutes avant la fin de l’enregistrement</b> à
            l’aéroport.
          </div>
          <div className="mt-2 text-sm text-yellow-200 bg-yellow-900/60 rounded px-3 py-2 max-w-md">
            <strong>Info :</strong> Des frais de nuit sont appliqués pour les
            arrivées ou retours entre <b>22h et 6h</b>.
          </div>
        </div>

        <BookingForm />
      </div>
</div>

    </div>
  );
};

export default Hero;
