import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-navy text-white" id="contact">
      <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              MS<span className="text-gold">Parking</span>
            </h3>
            <p className="mb-4">
              Service gardiennage et voiturier parter en vacance l&apos;esprit léger. Parking aéroport de bordeaux, service de navette.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-gold-light" aria-label="Facebook">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-white hover:text-gold-light" aria-label="Twitter">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-white hover:text-gold-light" aria-label="Instagram">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-gold-light transition-colors">Accueil</Link></li>
              <li><Link href="/#devis" className="hover:text-gold-light transition-colors">Demander un Devis</Link></li>
              <li><Link href="/rules" className="hover:text-gold-light transition-colors">Nos Règles</Link></li>
              <li><Link href="/faq" className="hover:text-gold-light transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-gold-light transition-colors">Contact</Link></li>
              <li><Link href="/CGU" className="hover:text-gold-light transition-colors">CGU</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-gold-light transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 flex-shrink-0 mt-1" />
                <span>157 avenue de beutre, 33600 Pessac</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>+33 06 09 04 18 79</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>contact@msparking.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} MsParking. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
