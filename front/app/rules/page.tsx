/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, AlertTriangle, Info, Car, Link } from "lucide-react";
import React from "react";

// ----- SEO -----
export const metadata = {
  title: "Règles du Service Voiturier | MsParking",
  keywords: "règles, service voiturier, sécurité, paiement, responsabilité, conditions générales, parking aéroport Bordeaux, bagages, nombre de passagers, annulation, réservation, voiturier Bordeaux-Mérignac",
  description: "Découvrez toutes les règles à respecter pour utiliser notre service de voiturier. Sécurité, paiement, responsabilité : informez-vous avant de réserver. Gardian de parking à l'aéroport de Bordeaux-Mérignac.",
  alternates: {
    canonical: "https://www.msparking.fr/rules",
  },
};

// ----- Bloc Rules JSON-LD -----
function RulesJsonLd() {
  const rulesList = [
    ...voiturierRules.map((r) => ({
      category: "Service de voiturier",
      ...r,
    })),
    ...serviceRules.map((r) => ({
      category: "Service",
      ...r,
    })),
    ...paymentRules.map((r) => ({
      category: "Paiement",
      ...r,
    })),
    ...liabilityRules.map((r) => ({
      category: "Responsabilité",
      ...r,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: rulesList.map((rule, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: rule.title,
      description: `${rule.description} ${rule.details}`,
      category: rule.category,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// --------- Règles du service voiturier -----------
const voiturierRules = [
  {
    title: "Ponctualité",
    description: "Merci d’arriver à l’heure convenue au point de rendez-vous indiqué à l’aéroport.",
    details: "En cas de retard important, le service ne pourra être garanti. Aucun remboursement ne pourra être exigé si le retard entraîne un désagrément de votre part.",
  },
  {
    title: "État des lieux du véhicule",
    description: "Un état des lieux rapide du véhicule sera effectué en votre présence lors de la prise en charge.",
    details: "Ce contrôle permet d’assurer la transparence et la sécurité du service pour le client comme pour le voiturier.",
  },
  {
    title: "Restitution du véhicule",
    description: "Le véhicule vous sera restitué à l’heure convenu lors de la réservation.",
    details: "Merci de fournir votre numéro de vol retour ou nous prévenir par mail en avance en cas de retard du vol ou autres soucis.",
  },
];


const serviceRules = [
  {
    title: "Remise des clés",
    description: "Remise obligatoire de toutes les clés du véhicule",
    details: "Incluant les clés de contact, télécommandes et clés de sécurité.",
  },
  {
    title: "Objets de valeur",
    description: "Retirez tous les objets de valeur du véhicule",
    details: "Nous ne sommes pas responsables des objets laissés dans le véhicule.",
  },
  {
    title: "Horaires de récupération",
    description: "Respectez les créneaux horaires convenus",
    details: "Prévenez-nous au moins 2h à l'avance en cas de changement d'horaire.",
  },
];

const paymentRules = [
  {
    title: "Paiement à l'avance",
    description: "Le service doit être payé lors de la réservation",
    details: "Paiement sécurisé par carte bancaire uniquement.",
  },
  {
    title: "Politique d'annulation",
    description: "Annulation gratuite jusqu'à 24h avant le service",
    details: "Passé ce délai, 50% du montant sera retenu.",
  },
  {
    title: "Services supplémentaires",
    description: "Les services additionnels sont facturés séparément pour ceux sur devis",
    details: "Lavage, révision technique, etc. selon tarifs en vigueur.",
  },
];

const liabilityRules = [
  {
    title: "Responsabilité limitée",
    description: "Notre responsabilité est limitée selon nos conditions générales",
    details: "Couverture maximale de 10 000€ pour les dommages directs.",
  },
  {
    title: "Force majeure",
    description: "Nous ne sommes pas responsables des cas de force majeure",
    details: "Conditions météorologiques extrêmes, grèves, événements imprévisibles.",
  },
  {
    title: "Utilisation du véhicule",
    description: "Le véhicule sera utilisé uniquement pour le stationnement",
    details: "Aucun déplacement non autorisé ne sera effectué.",
  },
];

// --------- RuleSection avec titres hiérarchiques ------------
function RuleSection({
  title,
  rules,
  icon: Icon,
  color,
  sectionLevel = 2,
}: {
  title: string;
  rules: any[];
  icon: any;
  color: string;
  sectionLevel?: number;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        {React.createElement(
          `h${sectionLevel}`,
          { className: "flex items-center gap-3 text-xl text-navy" },
          <>
            <Icon className={`w-6 h-6 ${color}`} />
            {title}
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rules.map((rule, index) => (
            <div key={index} className="border-l-4 border-gold pl-4">
              {React.createElement(
                `h${sectionLevel + 1}`,
                { className: "font-semibold text-navy mb-2" },
                rule.title
              )}
              <p className="text-gray-700 mb-2">{rule.description}</p>
              <p className="text-sm text-gray-600 italic">{rule.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


// --------- Composant principal -----------
export default function RulesPage() {
  return (
    <>
      <RulesJsonLd />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 pt-20" role="main">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-navy mb-4">
                Règles du Service
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Veuillez prendre connaissance de toutes les règles ci-dessous avant d&apos;utiliser notre service de voiturier. 
                Ces règles garantissent la sécurité et la qualité de notre prestation.
              </p>
            </div>
            <div className="mb-8 p-6 bg-primary-red-50 border border-primary-red-200 rounded-lg">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-primary-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-semibold text-primary-red-900 mb-2">Information importante</h2>
                  <p className="text-primary-red-800">
                    L&apos;acceptation de ces règles est obligatoire pour utiliser notre service. 
                    En réservant, vous confirmez avoir lu et accepté l&apos;ensemble de ces conditions.
                  </p>
                </div>
              </div>
            </div>
            <RuleSection 
              title="Règles concernant le service de voiturier"
              rules={voiturierRules}
              icon={Car}
              color="text-primary-red-600"
              sectionLevel={2}
            />
            <RuleSection 
              title="Règles du service"
              rules={serviceRules}
              icon={Check}
              color="text-blue-600"
              sectionLevel={2}
            />
            <RuleSection 
              title="Règles de paiement"
              rules={paymentRules}
              icon={Info}
              color="text-gold"
              sectionLevel={2}
            />
            <RuleSection 
              title="Responsabilité et limites"
              rules={liabilityRules}
              icon={AlertTriangle}
              color="text-primary-red-600"
              sectionLevel={2}
            />
            <div className="mt-12 p-6 bg-navy text-white rounded-lg text-center">
              <h2 className="text-xl font-bold mb-4">Questions sur nos règles ?</h2>
              <p className="mb-4">
                Notre équipe est disponible pour répondre à toutes vos questions concernant nos règles et conditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center gap-2">
                  <span>📧</span>
                  <span>contact@msparking.fr</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span>+33 06 09 04 18 79</span>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link href="/faq" className="text-gold underline hover:text-gold-dark">Voir aussi notre FAQ</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
