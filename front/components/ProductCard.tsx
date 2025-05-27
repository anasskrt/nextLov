"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const {
    id,
    name,
    brand,
    price,
    originalPrice,
    image,
    isNew,
    isSale,
    rating,
  } = product;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className={cn("product-card group", className)}>
      <div className="relative overflow-hidden">
        <Link href={`/product/${id}`} className="block">
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="product-image object-cover w-full h-auto"
            unoptimized // Si tes images viennent d'un CDN pas configuré dans next.config.js
          />
        </Link>

        {/* Quick actions */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && <span className="badge badge-new">New</span>}
          {isSale && originalPrice && (
            <span className="badge badge-sale">-{discount}%</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{brand}</div>
        <Link href={`/product/${id}`} className="block">
          <h3 className="font-medium mb-1 line-clamp-1 font-sans text-base hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-medium">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-gray-400 text-sm line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating stars */}
          <div className="flex items-center text-cream-800">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < rating ? "text-yellow-400" : "text-gray-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <Button className="w-full mt-4 bg-secondary hover:bg-secondary/80 text-primary">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;