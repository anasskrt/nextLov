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
import { Link } from "lucide-react";

// ----- SEO -----
export const metadata = {
  title: "FAQ - Service Voiturier | MSParking",
  keywords:
    "FAQ, questions fréquentes, service voiturier, sécurité, réservation, prix, conditions",
  description:
    "Questions fréquentes sur notre service de voiturier : sécurité, réservation, prix, conditions. Trouvez toutes les réponses pour une expérience sereine.",
  alternates: {
    canonical: "https://tonsite.fr/faq",
  },
};

// ----- Bloc FAQ JSON-LD -----
function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

const FAQ = () => {
  const faqs = [
    {
      question: "Comment fonctionne le service de voiturier ?",
      answer:
        "Notre service est simple : vous réservez en ligne, vous déposez votre véhicule à l'heure indiquée, nous vous déposons à l'aéroport de Bordeaux-Mérignac, nous gardons votre véhicule dans un parking sécurisé pendant votre absence, enfin nous vous récupérons à l'aéroport et nous vous restituons votre véhicule à votre retour.",
    },
    {
      question: "Quels est la limite de bagages autorisés ?",
      answer:
        "Chaque passager peut apporter une valise et un sac à main. Merci de respecter cette limite pour garantir le confort et la sécurité de tous dans la navette.",
    },
    {
      question: "La navette accueille jusqu’à 5 personnes maximum",
      answer:
        "Cette limite assure un trajet agréable et sécurisé pour tous les passagers.",
    },
    {
      question: "Où puis-je utiliser ce service ?",
      answer:
        "Nous sommes situé près de l'aéroport de Bordeaux, retrouvez dans contact l'adresse exacte.",
    },
    {
      question: "Quels sont les tarifs ?",
      answer:
        "Nos tarifs varient en fonction de la durée de stationnement et des options choisies. Retrouvez tous les détails sur notre page d'accueil. Nous proposons des tarifs compétitifs et transparents, sans frais cachés.",
    },
    {
      question: "Puis-je annuler ma réservation ?",
      answer:
        "Oui, vous pouvez annuler votre réservation jusqu'à 24 heures avant l'heure prévue sans frais. Les annulations tardives peuvent entraîner des frais selon nos conditions générales.",
    },
    {
      question: "Comment puis-je être sûr de la sécurité de mon véhicule ?",
      answer:
        "Nos parkings sont sécurisés 24h/24 avec surveillance vidéo, accès contrôlé et personnel de sécurité. Tous nos voituriers sont formés et assurés.",
    },
    {
      question: "Que se passe-t-il en cas de retard ?",
      answer:
        "En cas de retard de votre part à l’arrivée au parking, notre équipe fera son possible pour vous accompagner dans les meilleurs délais. Cependant, nous ne pourrons être tenus responsables si ce retard entraîne la perte de votre vol, ni assurer un remboursement.",
    },
    {
      question: "Quels types de véhicules acceptez-vous ?",
      answer:
        "Nous acceptons la plupart des véhicules particuliers : berlines, SUV, break, coupés, cabriolets. Pour tout véhicule spécifique, veuillez nous contacter.",
    },
    {
      question: "Comment se passe le paiement ?",
      answer:
        "Le paiement s'effectue en ligne lors de la réservation par carte bancaire. Le paiement est sécurisé et crypté.",
    },
    {
      question: "Que faire si j'ai oublié quelque chose dans ma voiture ?",
      answer:
        "Si vous avez oublié un objet dans votre voiture, soyez assuré que personne n’y touchera. Votre véhicule reste fermé et sécurisé pendant toute la durée de votre stationnement.",
    },
    {
      question: "Le service est-il disponible 24h/24 ?",
      answer:
        "Nos services de prise en charge et de restitution sont disponibles 24h/24 tous les jours. Pour des créneaux de 22h à 6h nous ajoutons un frais.",
    },
    {
      question: "Le service est-il accessible aux personnes en situation de handicap ?",
      answer:
        "Oui, nous accueillons les personnes en situation de handicap. Une marche est mise à disposition afin de faciliter l’accès au véhicule. N'hésitez pas à nous le signaler lors de votre réservation pour que nous puissions préparer votre accueil dans les meilleures conditions.",
    },
    {
      question: "Puis-je utiliser le service avec un véhicule utilitaire ?",
      answer:
        "Les véhicules utilitaires ne sont pas acceptés automatiquement. Si vous souhaitez réserver avec ce type de véhicule, merci de nous contacter au préalable via le formulaire de la page Contact ou par téléphone afin de vérifier la faisabilité.",
    },
  ];

  return (
    <>
      <FAQJsonLd faqs={faqs} />
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
                n&apos;hésitez pas à nous contacter.
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
                            <h2 className="text-lg font-semibold m-0">{faq.question}</h2>
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
                      Besoin d&apos;aide ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-navy mb-2">
                        Service Client
                      </h3>
                      <p className="text-sm text-gray-600">
                        Notre équipe est disponible pour vous aider
                      </p>
                      <p className="text-sm font-medium">📞 01 23 45 67 89</p>
                      <p className="text-sm font-medium">
                        ✉️ contact@msparking.fr
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-navy mb-2">Horaires</h3>
                      <p className="text-sm text-gray-600">
                        Lun-Dim : 24h00 - 24h00
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
                      <h4 className="font-medium text-navy">Délai d&apos;annulation</h4>
                      <p className="text-sm text-gray-600">
                        24h avant le service
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-navy">Documents requis</h4>
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
                      Notre équipe est là pour vous aider. N&apos;hésitez pas à nous
                      contacter !
                    </p>
                    <Link
                      href="/contact"
                      className="inline-block bg-gold hover:bg-gold-dark text-navy font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Nous contacter
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
