"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import ProductCard from "@/components/ProductCard";
import { products, categoryList } from "@/data/products";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Average Rating" },
];

const brands = ["GlowRx", "CoverWell", "TressLuxe", "PureSpa", "ScentMuse"];

const CategoryPage = () => {
  const params = useParams();
  const id = params?.id as string; // Next.js useParams retourne un objet (id est undefined ou string)

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Get category info
  const category = categoryList.find((cat) => cat.id === id);

  // Filter products by category
  const filteredProducts = products.filter((product) => {
    if (id && product.category !== id) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleBrandFilter = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 100]);
  };

  return (
    <div className="pb-16">
      {/* Category Header */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />
            {id ? (
              <span className="text-gray-800 font-medium capitalize">
                {id.replace("-", " ")}
              </span>
            ) : (
              <span className="text-gray-800 font-medium">All Products</span>
            )}
          </nav>

          <h1 className="text-4xl md:text-5xl font-serif mb-4 capitalize">
            {category?.name || "All Products"}
          </h1>
          {category && (
            <p className="text-gray-600 max-w-2xl">{category.description}</p>
          )}
        </div>
      </div>

      {/* Product Listing */}
      <div className="container mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Filter Button */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filters - Mobile */}
          {filtersOpen && (
            <div className="fixed inset-0 bg-white z-50 overflow-auto lg:hidden">
              <div className="p-4 border-b sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={priceRange}
                      onValueChange={(value : any) => setPriceRange(value as [number, number])}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <div>${priceRange[0]}</div>
                      <div>${priceRange[1]}</div>
                    </div>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={`brand-mobile-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrandFilter(brand)}
                        />
                        <label
                          htmlFor={`brand-mobile-${brand}`}
                          className="ml-2 text-sm"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setFiltersOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Filters - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-medium">Filters</h2>
                  <Button
                    variant="ghost"
                    className="text-xs text-gray-500"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="font-medium text-sm mb-4">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={priceRange}
                      onValueChange={(value : any) => setPriceRange(value as [number, number])}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <div>${priceRange[0]}</div>
                      <div>${priceRange[1]}</div>
                    </div>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-4">
                  <h3 className="font-medium text-sm mb-4">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrandFilter(brand)}
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options - Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="text-sm text-gray-500">
                Showing {sortedProducts.length} products
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters.</p>
                <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
