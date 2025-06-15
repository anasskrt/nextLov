import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollText } from "lucide-react";

export const metadata = {
  title: "Conditions Générales d'Utilisation | msparking",
  keywords: "cgu, conditions générales, voiturier, parking, msparking, bordeaux, navette, règlement",
  description: "Consultez les conditions générales d'utilisation du service msparking : fonctionnement, réservation, paiement, annulation, responsabilité, données personnelles.",
  alternates: {
    canonical: "https://www.msparking.fr/cgu",
  },
};

const CGU = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-8">
              <ScrollText className="h-8 w-8 text-navy" />
              <h1 className="text-3xl font-bold text-navy">Conditions Générales d'Utilisation</h1>
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-navy mb-4">Article 1 - Objet</h2>
              <p className="mb-6">
                Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation des services proposés sur le site msparking.fr (ci-après : le "Service"), ainsi que de définir les droits et obligations des parties dans ce cadre.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 2 - Acceptation des conditions</h2>
              <p className="mb-6">
                L'accès et l'utilisation du site supposent l'acceptation et le respect de l'ensemble des termes des présentes conditions générales d'utilisation.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 3 - Services proposés</h2>
              <p className="mb-6">
                msparking propose des services de gardiennage de véhicules et de voiturier, incluant :
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Gardiennage sécurisé de véhicules</li>
                <li>Service de navette vers les aéroports</li>
                <li>Réservation en ligne</li>
              </ul>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 4 - Tarifs et paiement</h2>
              <p className="mb-6">
                Les tarifs des services sont indiqués en euros TTC. Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée Stripe. La facturation intervient au moment de la confirmation de la réservation.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 5 - Responsabilité</h2>
              <p className="mb-6">
                msparking s'engage à assurer la sécurité des véhicules confiés dans le cadre de ses services. Une assurance responsabilité civile professionnelle couvre les dommages éventuels. Le client doit signaler tout dommage préexistant lors de la prise en charge du véhicule.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 6 - Annulation et remboursement</h2>
              <p className="mb-6">
                Toute annulation doit être signalée au moins 24h avant la prestation. En cas d'annulation tardive, des frais d'annulation peuvent s'appliquer selon les conditions tarifaires en vigueur.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 7 - Protection des données</h2>
              <p className="mb-6">
                Les données personnelles collectées sont nécessaires à la prestation de service et sont traitées conformément au RGPD. Elles ne sont pas transmises à des tiers sans consentement explicite.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 8 - Droit applicable</h2>
              <p className="mb-6">
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 9 - Modification des CGU</h2>
              <p className="mb-6">
                msparking se réserve le droit de modifier les présentes CGU à tout moment. Les nouvelles conditions seront applicables dès leur mise en ligne.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CGU;