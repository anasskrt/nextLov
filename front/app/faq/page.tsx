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
import Link from "next/link";

// ----- SEO -----
export const metadata = {
  title: "FAQ - Gardiennage Automobile & Voiturier | MSParking Bordeaux",
  keywords:
    "FAQ, questions fréquentes, gardiennage automobile, parking sécurisé, voiturier Bordeaux, réservation parking, sécurité véhicule",
  description:
    "Réponses aux questions fréquentes sur notre service de gardiennage automobile, parking sécurisé et voiturier à Bordeaux-Mérignac avec MSParking. Trouvez toutes les réponses pour voyager sereinement.",
  alternates: {
    canonical: "https://msparking.fr/faq",
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
        "Réservez en ligne, déposez votre véhicule à l'heure indiquée, nous vous déposons à l'aéroport de Bordeaux-Mérignac, gardons votre véhicule sécurisé, puis vous récupérons à votre retour pour la restitution de votre véhicule.",
    },
    {
      question: "Où puis-je utiliser ce service ?",
      answer:
        "Notre parking est situé à proximité immédiate de l'aéroport de Bordeaux-Mérignac. Retrouvez notre adresse exacte sur la page Contact.",
    },
    {
      question: "Quels sont les tarifs ?",
      answer:
        "Les tarifs varient selon la durée et les options choisies. Consultez notre page d'accueil pour des tarifs compétitifs sans frais cachés.",
    },
    {
      question: "Puis-je annuler ma réservation ?",
      answer:
        "Oui, sans frais jusqu'à 24h avant votre arrivée. Des frais peuvent s'appliquer en cas d'annulation tardive selon nos conditions générales.",
    },
    {
      question: "Comment puis-je être sûr de la sécurité de mon véhicule ?",
      answer:
        "Nos parkings sont surveillés 24h/24 par vidéo HD, patrouilles régulières, accès contrôlés et personnel formé et assuré.",
    },
    {
      question: "Que se passe-t-il en cas de retard ?",
      answer:
        "En cas de retard, informez-nous au plus vite. Nous ferons notre possible pour vous accommoder mais ne serons pas responsables d’éventuels manquements liés à votre retard.",
    },
    {
      question: "Quels types de véhicules acceptez-vous ?",
      answer:
        "Berlines, SUV, breaks, coupés, cabriolets sont acceptés. Contactez-nous directement pour les véhicules spéciaux ou utilitaires.",
    },
    {
      question: "Comment se passe le paiement ?",
      answer:
        "Le paiement s'effectue en ligne, sécurisé et crypté, par carte bancaire lors de la réservation.",
    },
    {
      question: "Que faire si j'ai oublié quelque chose dans ma voiture ?",
      answer:
        "Votre véhicule reste fermé et sécurisé durant tout votre séjour. Aucun objet ne sera déplacé ou retiré.",
    },
    {
      question: "Le service est-il disponible 24h/24 ?",
      answer:
        "Oui, nos services sont disponibles en continu. Des frais supplémentaires peuvent s'appliquer entre 22h et 6h.",
    },
    {
      question: "Le service est-il accessible aux personnes en situation de handicap ?",
      answer:
        "Oui, une assistance adaptée est disponible. Informez-nous lors de votre réservation pour que nous préparions votre accueil.",
    },
    {
      question: "Puis-je réserver avec un véhicule utilitaire ?",
      answer:
        "Veuillez nous contacter directement pour vérifier la faisabilité de votre réservation avec un véhicule utilitaire.",
    },
  ];

  return (
    <>
      <FAQJsonLd faqs={faqs} />
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow bg-gray-50 pt-20">
          <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-navy mb-4">
                Questions Fréquemment Posées
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Toutes les réponses pour profiter sereinement de notre service de gardiennage automobile et voiturier à Bordeaux-Mérignac.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-navy">FAQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
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
                      <p className="text-sm font-medium">📞 06 09 04 18 79</p>
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
                      className="inline-block bg-navy-light hover:bg-navy text-white font-semibold px-4 py-2 rounded-lg transition-colors"
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
