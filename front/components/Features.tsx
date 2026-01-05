import { Shield, Clock, Car, Award, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-10 h-10 text-gold" />,
      title: "Sécurité Maximale",
      description:
        "Parking sécurisé 24h/24 avec vidéo-surveillance et personnel présent sur place en permanence.",
    },
    {
      icon: <Clock className="w-10 h-10 text-gold" />,
      title: "Service Ponctuel",
      description:
        "Notre voiturier est toujours prêt pile à l'heure pour vous accueillir.",
    },
    {
      icon: <Car className="w-10 h-10 text-gold" />,
      title: "Soin du Véhicule",
      description:
        "Services additionnels disponibles: lavage, nettoyage intérieur, et plus encore.",
    },
    {
      icon: <Award className="w-10 h-10 text-gold" />,
      title: "Personnel Qualifié",
      description:
        "Tous nos voituriers sont des professionnels formés et assurés pour manipuler tout type de véhicule.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="services">
      <div className="page-container">
        <h2 className="section-heading text-center">Nos Services de Qualités</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform hover:scale-105"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-navy">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-navy">Service sur Mesure pour Tous Vos Besoins</h3>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Que vous partiez en voyage d&apos;affaires, en vacances, ou que vous ayez besoin d&apos;un service régulier,
            notre équipe s&apos;adapte à vos besoins spécifiques pour vous offrir une solution personnalisée.
          </p>
          <Button className="bg-navy hover:bg-navy-light">
            <Link href="#devis">Obtenir un Devis Personnalisé</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
