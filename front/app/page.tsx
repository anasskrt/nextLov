"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import {
  featuredProducts,
  newArrivals,
  onSale,
  categoryList,
} from "@/data/products";

export default function HomePage() {
  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[550px] flex items-center">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary to-lavender-50">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        </div>

        <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2">
          <Image
            src="https://images.unsplash.com/photo-1607602132700-068258431c6c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Beauty Products"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl mt-16">
            <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4 text-white drop-shadow-md">
              Discover Your Beauty Essentials
            </h1>
            <p className="text-lg mb-8 text-white/90 drop-shadow">
              Shop the latest trends in skincare, makeup, and self-care products. Curated for your beauty routine.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href="/category/skincare">Shop Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/20"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <h2 className="text-3xl font-serif mb-2">Shop by Category</h2>
              <p className="text-gray-600">Explore our wide range of beauty products</p>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm"
            >
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryList.slice(0, 3).map((category) => (
              <Link
                href={`/category/${category.id}`}
                key={category.id}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-serif">{category.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {categoryList.slice(3, 5).map((category) => (
              <Link
                href={`/category/${category.id}`}
                key={category.id}
                className="group relative overflow-hidden rounded-2xl aspect-[5/2]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-serif">{category.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="featured" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-3xl font-serif mb-2">Our Products</h2>
                <TabsList className="bg-transparent h-auto p-0 mt-4">
                  <TabsTrigger
                    value="featured"
                    className="category-pill bg-white data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Featured
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="category-pill bg-white data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    New Arrivals
                  </TabsTrigger>
                  <TabsTrigger
                    value="sale"
                    className="category-pill bg-white data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    On Sale
                  </TabsTrigger>
                </TabsList>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm"
              >
                View All Products <ArrowRight size={16} />
              </Link>
            </div>

            <TabsContent value="featured" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sale" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {onSale.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <div className="flex justify-center mt-8 md:hidden">
              <Button asChild variant="outline">
                <Link href="/products" className="flex items-center gap-1">
                  View All Products <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
