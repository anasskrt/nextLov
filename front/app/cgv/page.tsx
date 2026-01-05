import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollText } from "lucide-react";

export const metadata = {
  title: "Conditions Générales de vente | msparking",
  keywords: "cgv, conditions générales, voiturier, parking, msparking, bordeaux, règlement",
  description: "Consultez les conditions générales de vente du service msparking : fonctionnement, réservation, paiement, annulation, responsabilité, données personnelles.",
  alternates: {
    canonical: "https://www.msparking.fr/cgv",
  },
};

const CGV = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-16 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-8">
              <ScrollText className="h-8 w-8 text-navy" />
              <h1 className="text-3xl font-bold text-navy">Conditions Générales de Vente</h1>
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-navy mb-4">Article 1 - Objet</h2>
              <p className="mb-6">
                Les présentes conditions définissent les modalités des services de voiturier et de parking proposés par MSPARKING. Toute réservation implique l&apos;adhésion sans réserve à ces conditions.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 2 - État des lieux du véhicule</h2>
              <p className="mb-6">
                Pour la sécurité du client et de MSPARKING, un <strong>état des lieux photographique ou descriptif est réalisé systématiquement</strong> lors de la prise en charge de chaque véhicule. 
                En cas de litige au retour, seules les dégradations non présentes sur l&apos;état des lieux initial pourront être prises en considération. Le client est tenu de vérifier son véhicule lors de la restitution en présence du voiturier. Toute réclamation ultérieure ne sera pas recevable.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 3 - Retards et Modifications d&apos;horaires</h2>
              <p className="mb-6">
                <strong>Retard du client :</strong> Le client a l&apos;obligation de prévenir MSPARKING par téléphone de tout retard de plus de 30 minutes. 
                <br /><br />
                <strong>Frais de dépassement :</strong> En cas de retour différé (vol décalé, etc.), des frais journaliers supplémentaires basés sur le tarif en vigueur seront appliqués. 
                <br /><br />
                <strong>Arrivée anticipée :</strong> Si le client se présente avant l&apos;heure convenue ou sans coordination préalable au dépose-minute, les frais de stationnement (ticket de sortie du dépose-minute de l&apos;aéroport) seront <strong>intégralement à la charge du client</strong>.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 4 - Absence de vol (No-Show) et Annulation</h2>
              <p className="mb-6">
                Dans le cas où le client raterait son vol de départ, MSPARKING s&apos;engage à lui restituer son véhicule dans les plus brefs délais sur demande. 
                Cependant, <strong>aucun remboursement de la prestation de parking</strong> ne sera effectué, la place ayant été réservée et le personnel mobilisé.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 5 - Responsabilité et Objets personnels</h2>
              <p className="mb-6">
                MSPARKING décline toute responsabilité en cas de perte, de vol ou de disparition d&apos;objets personnels laissés à l&apos;intérieur du véhicule (GPS, téléphones, monnaie, bijoux, bagages, etc.). 
                Il appartient au client de s&apos;assurer qu&apos;aucun objet de valeur ne reste dans l&apos;habitacle. La responsabilité de MSPARKING est strictement limitée au véhicule lui-même.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 6 - Tarifs et Paiement</h2>
              <p className="mb-6">
                Les prix sont indiqués en euros TTC. Le paiement s&apos;effectue via la plateforme sécurisée Stripe lors de la réservation. Toute prestation supplémentaire (dépassement d&apos;horaire) devra être réglée avant la restitution définitive du véhicule.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Article 7 - Droit applicable</h2>
              <p className="mb-6">
                Les présentes conditions sont soumises au droit français. En cas de contestation, et après échec d&apos;une tentative de conciliation amiable, les tribunaux de Bordeaux seront seuls compétents.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CGV;