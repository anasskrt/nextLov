import { ReactNode } from "react";
import ClientProviders from "./client-providers";
import "./globals.css";

export const metadata = {
  title: "MsParking - Parking aéroport de Bordeaux sécurisé",
  description: "MsParking, parking près de l'aéroport de Bordeaux, sécurisé. Service de voiturier et navette.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: "parking aéroport Bordeaux, parking sécurisé, voiturier Bordeaux, navette aéroport, parking pas cher, réservation parking, parking longue durée, parking courte durée, gardiennage aéroport Bordeaux, gardiennage automobile aéroport Bordeaux",
  alternates: {
    canonical: "https://msparking.fr/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="google-site-verification" content="0wDXseD4IEkekrK-9Nd4o4tZZxpQDeYr6nKyvK5pyGs" />
        <meta name="description" content="MsParking, parking sécurisé près de l'aéroport de Bordeaux. Réservez votre place avec voiturier ou navette, ouvert 24h/24, prix attractifs, à 5 minutes de l'aéroport de Bordeaux." />
        <meta name="keywords" content="parking aéroport Bordeaux, parking Bordeaux, voiturier Bordeaux, navette aéroport, parking sécurisé, parking pas cher, MsParking, Mérignac, Pessac, réservation parking, parking longue durée, parking courte durée, parking proche aéroport Bordeaux" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="MsParking - Parking aéroport de Bordeaux sécurisé" />
        <meta property="og:description" content="Parking sécurisé avec voiturier ou navette à l'aéroport de Bordeaux. Réservez en ligne, service rapide et fiable, à 5 minutes de l'aéroport de Bordeaux." />
        <meta property="og:url" content="https://msparking.fr/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/msparking_fav.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MsParking - Parking aéroport de Bordeaux sécurisé" />
        <meta name="twitter:description" content="Parking sécurisé avec voiturier ou navette à l'aéroport de Bordeaux. Réservez en ligne, service rapide et fiable." />
        <meta name="twitter:image" content="/msparking_fav.png" />
        <link rel="canonical" href="https://msparking.fr/" />
        {/* Données structurées schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: `
          {
            "@context": "https://schema.org",
            "@type": "ParkingFacility",
            "name": "MsParking",
            "url": "https://msparking.fr/",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "159 avenue de beutre",
              "addressLocality": "Bordeaux",
              "postalCode": "33600",
              "addressCountry": "FR"
            },
            "telephone": "0609041879",
            "image": "https://msparking.fr/favicon.ico",
            "description": "Parking sécurisé avec voiturier et navette à 5 minutes de l'aéroport de Bordeaux."
          }
          `
        }} />

      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16808260855"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16808260855');
            
            // Fonction de conversion pour les achats
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-16808260855/7SATCKqYz9MbEPfp5s4-',
                'value': 1.0,
                'currency': 'EUR',
                'transaction_id': '',
                'event_callback': callback
              });
              return false;
            }
          `,
        }}
      />

      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
