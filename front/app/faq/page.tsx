import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "Comment fonctionne le service de voiturier ?",
      answer:
        "Notre service est simple : vous réservez en ligne, nous récupérons votre véhicule à l'heure convenue, nous le gardons dans un parking sécurisé pendant votre absence, et nous vous le restituons à votre retour. Tout se fait avec un voiturier professionnel.",
    },
    {
      question: "Où puis-je utiliser ce service ?",
      answer:
        "Nous opérons principalement dans les aéroports, gares et centres-villes. Vous pouvez spécifier le lieu de prise en charge lors de votre réservation. Consultez notre carte de couverture pour vérifier la disponibilité dans votre zone.",
    },
    {
      question: "Mon véhicule est-il assuré pendant le service ?",
      answer:
        "Oui, votre véhicule est couvert par notre assurance professionnelle pendant toute la durée du service. Nous effectuons également une inspection complète avant et après le service pour documenter l'état de votre véhicule.",
    },
    {
      question: "Quels sont les tarifs ?",
      answer:
        "Nos tarifs varient selon le service choisi : Service Basique (25€/jour), Service Premium (45€/jour), ou Service Luxe (75€/jour). Le prix final dépend de la durée et des options sélectionnées.",
    },
    {
      question: "Puis-je annuler ma réservation ?",
      answer:
        "Oui, vous pouvez annuler votre réservation jusqu'à 24 heures avant l'heure prévue sans frais. Les annulations tardives peuvent entraîner des frais selon nos conditions générales.",
    },
    {
      question: "Comment puis-je être sûr de la sécurité de mon véhicule ?",
      answer:
        "Nos parkings sont sécurisés 24h/24 avec surveillance vidéo, accès contrôlé et personnel de sécurité. Tous nos voituriers sont formés et assurés. Nous fournissons également des photos avant/après pour les services Premium et Luxe.",
    },
    {
      question: "Que se passe-t-il en cas de retard ?",
      answer:
        "Si vous êtes en retard pour la récupération, contactez-nous immédiatement. Nous offrons une période de grâce de 2 heures gratuites, au-delà de laquelle des frais supplémentaires peuvent s'appliquer.",
    },
    {
      question: "Puis-je modifier ma réservation ?",
      answer:
        "Oui, vous pouvez modifier les détails de votre réservation (dates, heures, lieu) jusqu'à 12 heures avant le service, sous réserve de disponibilité. Contactez notre service client pour toute modification.",
    },
    {
      question: "Quels types de véhicules acceptez-vous ?",
      answer:
        "Nous acceptons la plupart des véhicules particuliers : berlines, SUV, break, coupés, cabriolets. Pour les véhicules de collection, motos ou véhicules spéciaux, contactez-nous pour vérifier nos capacités.",
    },
    {
      question: "Comment se passe le paiement ?",
      answer:
        "Le paiement s'effectue en ligne lors de la réservation par carte bancaire. Nous acceptons Visa, Mastercard et American Express. Le paiement est sécurisé et crypté.",
    },
    {
      question: "Que faire si j'ai oublié quelque chose dans ma voiture ?",
      answer:
        "Nous vérifions systématiquement l'intérieur des véhicules. Si vous avez oublié quelque chose, contactez-nous immédiatement. Nous pourrons vous aider à récupérer vos affaires selon nos procédures de sécurité.",
    },
    {
      question: "Le service est-il disponible 24h/24 ?",
      answer:
        "Nos services de prise en charge et de restitution sont disponibles de 5h à 23h tous les jours. Pour des créneaux exceptionnels, contactez notre service client qui étudiera votre demande.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">
              Questions Fréquemment Posées
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur notre service
              de voiturier. Si vous ne trouvez pas ce que vous cherchez,
              n'hésitez pas à nous contacter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne FAQ */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-navy">FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Colonne Infos */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-navy">
                    Besoin d'aide ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-navy mb-2">
                      Service Client
                    </h4>
                    <p className="text-sm text-gray-600">
                      Notre équipe est disponible pour vous aider
                    </p>
                    <p className="text-sm font-medium">📞 01 23 45 67 89</p>
                    <p className="text-sm font-medium">
                      ✉️ contact@msparking.fr
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-navy mb-2">Horaires</h4>
                    <p className="text-sm text-gray-600">
                      Lun-Dim : 5h00 - 23h00
                      <br />
                      Support client : 8h00 - 20h00
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-navy">
                    Informations Utiles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h5 className="font-medium text-navy">Délai d'annulation</h5>
                    <p className="text-sm text-gray-600">
                      24h avant le service
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-navy">Période de grâce</h5>
                    <p className="text-sm text-gray-600">
                      2h gratuites en cas de retard
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-navy">Documents requis</h5>
                    <p className="text-sm text-gray-600">
                      Permis de conduire et papiers du véhicule
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-navy">
                    Vous avez une question ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Notre équipe est là pour vous aider. N'hésitez pas à nous
                    contacter !
                  </p>
                  <a
                    href="/contact"
                    className="inline-block bg-gold hover:bg-gold-dark text-navy font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Nous contacter
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
