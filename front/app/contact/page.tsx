import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleMap from "@/components/GoogleMap";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | MsParking Bordeaux",
  description: "Contactez l'équipe MsParking pour toute question, demande de devis ou assistance concernant notre service de voiturier à Bordeaux.",
  keywords: "contact, parking, Bordeaux, voiturier, devis, assistance, téléphone, email",
  alternates: {
    canonical: "https://www.msparking.fr/contact",
  },
};

const ContactPage = () => {
  return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow bg-gray-50 pt-20">
          <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-navy mb-4">Contactez-nous</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nous sommes là pour répondre à toutes vos questions concernant nos services de gardiennage et voiturier.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Carte Google Maps */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-navy mb-4">Notre localisation</h2>
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">157 avenue de beutre</p>
                    <p className="text-gray-600 mb-2">33600 Pessac</p>
                    <p className="text-gray-600">+33 06 09 04 18 79</p>
                  </div>
                </div>
                <div className="h-80">
                  <GoogleMap />
                </div>
              </div>

              {/* Formulaire de contact */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-navy mb-6">Envoyez-nous un message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Informations de contact supplémentaires */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <InfoCard
                icon="phone"
                title="Téléphone"
                text="+33 06 09 04 18 79"
              />
              <InfoCard
                icon="mail"
                title="Email"
                text="contact@msparking.fr"
              />
              <InfoCard
                icon="clock"
                title="Horaires"
                text="Lun-Dim: 24h/24"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
};

// Composant pour la section "Téléphone / Email / Horaires"
const InfoCard = ({
  icon,
  title,
  text,
}: {
  icon: "phone" | "mail" | "clock";
  title: string;
  text: string;
}) => {
  const icons = {
    phone: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
    mail: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    clock: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  return (
    <div className="text-center">
      <div className="bg-gold rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icons[icon]}
        </svg>
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
};

export default ContactPage;
