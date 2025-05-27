"use client";

import React, { useState } from "react";
import Link from "next/link"; // Remplacer react-router-dom par next/link
import { ShoppingBag, Search, Menu, X, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const categories = [
    { name: "Skincare", path: "/category/skincare" },
    { name: "Makeup", path: "/category/makeup" },
    { name: "Hair", path: "/category/hair" },
    { name: "Bath & Body", path: "/category/bath-body" },
    { name: "Fragrance", path: "/category/fragrance" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-primary">Parafrance</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                href={category.path}
                className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/wishlist" className="hidden sm:flex">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-600 hover:text-primary"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/account" className="hidden sm:flex">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-600 hover:text-primary"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-600 hover:text-primary relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-3 border-t animate-slide-up">
            <div className="relative">
              <Input 
                type="text"
                placeholder="Search for products..." 
                className="w-full pl-10 pr-4 py-2"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t animate-slide-up">
            <nav className="flex flex-col py-4 space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.path}
                  className="text-gray-600 hover:text-primary transition-colors px-4 py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
