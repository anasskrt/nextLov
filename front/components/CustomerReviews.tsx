import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Le composant n'utilise pas de state, donc export normal Server Component
const reviews = [
  {
    name: "Marie D.",
    rating: 5,
    text: "Service irréprochable ! J'ai laissé ma voiture pendant 10 jours, elle était impeccable à mon retour.",
    date: "Il y a 2 semaines"
  },
  {
    name: "Pierre M.",
    rating: 5,
    text: "Excellent rapport qualité-prix. Le parking est très sécurisé. Je recommande vivement MSParking !",
    date: "Il y a 1 mois"
  },
  {
    name: "Sophie B.",
    rating: 5,
    text: "Très satisfaite du service. Personnel accueillant, parking bien situé et sécurisé. Mon véhicule était même lavé à mon retour. Parfait !",
    date: "Il y a 3 semaines"
  },
  {
    name: "Thomas L.",
    rating: 5,
    text: "Service 24h/24 très pratique pour mes voyages d'affaires. Tarifs corrects et service de qualité.",
    date: "Il y a 1 semaine"
  }
];

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-gray-50" id="reviews">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui nous font confiance 
            pour le gardiennage de leur véhicule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-gold mr-3" />
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gold fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 flex-grow italic">
                  &quot;{review.text}&quot;
                </p>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-navy">{review.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{review.date}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
