import { ReactNode } from "react";
import ClientProviders from "./client-providers";
import "./globals.css";

export const metadata = {
  title: "MsParking - Parking Bordeaux Aéroport",
  description: "Réservez votre place de parking avec navette gratuite à Bordeaux Aéroport.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://msparking.fr/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="google-site-verification" content="0wDXseD4IEkekrK-9Nd4o4tZZxpQDeYr6nKyvK5pyGs" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
