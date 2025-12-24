import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Mentions légales | msparking",
  description:
    "Retrouvez ici toutes les mentions légales du site msparking : éditeur, hébergeur, propriété intellectuelle et protection des données personnelles.",
  alternates: {
    canonical: "https://www.msparking.fr/mentions-legales",
  },
};

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-16 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-8">
              <FileText className="h-8 w-8 text-navy" />
              <h1 className="text-3xl font-bold text-navy">Mentions Légales</h1>
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-navy mb-4">MSPARKING</h2>
              <p className="mb-6">
                <strong>msparking</strong><br />
                Société par actions simplifiée au capital de 1 000 €<br />
                RCS Bordeaux 993 842 822<br />
                Siège social : 157 avenue de beutre, 33600 Pessac<br />
                Téléphone : +33 06 09 04 18 79<br />
                Email : contact@msparking.fr
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Hébergement</h2>
              <p className="mb-6">
                Le site est hébergé par la société <strong>Render Services, Inc.</strong><br />
                Adresse : 525 Brannan St STE 300, San Francisco, CA 94107, États-Unis.<br />
                Site web : https://render.com
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Directeur responsable de la publication</h2>
              <p className="mb-6">
                Coordonnée : contact@msparking.fr
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Propriété intellectuelle</h2>
              <p className="mb-6">
              La structure générale ainsi que les textes, images, logos et tout autre élément composant le site sont la propriété exclusive de MSPARKING. Toute reproduction, totale ou partielle, de ce site par quelque procédé que ce soit, sans l&apos;autorisation expresse de l&apos;éditeur, est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
              </p>  

              <h2 className="text-xl font-semibold text-navy mb-4">Protection des données (RGPD)</h2>
              <p className="mb-6">
                Les informations recueillies via nos formulaires (réservation, contact) sont enregistrées dans un fichier informatisé par MSPARKING pour la gestion de la clientèle et le suivi des réservations.
                <br /><br />
                Conformément à la loi « informatique et libertés » et au RGPD, vous pouvez exercer votre droit d&apos;accès aux données vous concernant et les faire rectifier ou supprimer en contactant : <strong>contact@msparking.fr</strong>.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Cookies</h2>
              <p className="mb-6">
                Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur et analyser le trafic. En continuant à naviguer sur ce site, vous acceptez l&apos;utilisation de cookies.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Responsabilité</h2>
              <p className="mb-6">
                Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l&apos;année, mais peut toutefois contenir des inexactitudes ou des omissions.
              </p>

              <h2 className="text-xl font-semibold text-navy mb-4">Droit applicable</h2>
              <p className="mb-6">
                Le présent site est soumis au droit français.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MentionsLegales;