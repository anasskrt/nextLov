"use client";

import React from "react";
import Link from "next/link"; // Import de next/link pour remplacer react-router-dom
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="max-w-xl mx-auto text-center mb-12">
          <h3 className="text-2xl mb-4">Join our newsletter</h3>
          <p className="text-gray-600 mb-6">
            Subscribe to get special offers, free giveaways, and beauty tips.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1"
            />
            <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl mb-4 font-serif">BeautyShelf</h3>
            <p className="text-gray-600 mb-4">
              Your one-stop destination for premium cosmetics, skincare, and beauty products.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/category/skincare" className="text-gray-600 hover:text-primary text-sm">Skincare</Link></li>
              <li><Link href="/category/makeup" className="text-gray-600 hover:text-primary text-sm">Makeup</Link></li>
              <li><Link href="/category/hair" className="text-gray-600 hover:text-primary text-sm">Hair</Link></li>
              <li><Link href="/category/bath-body" className="text-gray-600 hover:text-primary text-sm">Bath & Body</Link></li>
              <li><Link href="/category/fragrance" className="text-gray-600 hover:text-primary text-sm">Fragrance</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-600 hover:text-primary text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-primary text-sm">FAQs</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-primary text-sm">Shipping & Returns</Link></li>
              <li><Link href="/track-order" className="text-gray-600 hover:text-primary text-sm">Track Order</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-primary text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div className="md:col-span-1">
            <h4 className="font-medium mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-primary text-sm">About Us</Link></li>
              <li><Link href="/sustainability" className="text-gray-600 hover:text-primary text-sm">Sustainability</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-primary text-sm">Careers</Link></li>
              <li><Link href="/press" className="text-gray-600 hover:text-primary text-sm">Press</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-primary text-sm">Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BeautyShelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
