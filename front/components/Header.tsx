"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, UserRound, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl text-navy">
                MS<span className="text-gold">Parking</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="font-medium text-navy hover:text-navy-light transition-colors">
              Accueil
            </Link>
            <Link href="/rules" className="font-medium text-navy hover:text-navy-light transition-colors">
              Nos Règles
            </Link>
            <Link href="/faq" className="font-medium text-navy hover:text-navy-light transition-colors">FAQ</Link>
            <Link href="/contact" className="font-medium text-navy hover:text-navy-light transition-colors">
              Contact
            </Link>
            <Link href="/blog" className="font-medium text-navy hover:text-navy-light transition-colors">
              Blog
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-navy hover:bg-navy-light text-white">
              <Link href="/#devis">Demander un devis</Link>
            </Button>
            {isAdmin && (
              <Link href="/admin" className="text-navy hover:text-navy-light" title="Administration">
                <Settings size={24} />
              </Link>
            )}
            {isLoggedIn ? (
              <Link href="/profil" className="text-navy hover:text-navy-light">
                <UserRound size={24} />
              </Link>
            ) : (
              <Link href="/connexion" className="text-navy hover:text-navy-light">
                <UserRound size={24} />
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="text-navy">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link href="/" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md">
              Accueil
            </Link>
            <Link href="/rules" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md">
              Nos Règles
            </Link>
            <Link href="/faq" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>FAQ</Link>

            <Link href="/contact" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md">
              Contact
            </Link>

            <Link href="/blog" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md">
              Blog
            </Link>

            {isAdmin && (
              <Link href="/admin" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Administration</Link>
            )}
            {isLoggedIn ? (
              <Link href="/profile" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Mon Profil
              </Link>
            ) : (
              <Link href="/connexion" className="block px-3 py-2 text-navy font-medium hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Connexion
              </Link>
            )}
            <div className="mt-4 px-3">
              <Button className="w-full bg-navy hover:bg-navy-light text-white">
                <Link href="/#devis" onClick={() => setIsMenuOpen(false)}>Demander un devis</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

// This code defines a responsive header component for a web application.