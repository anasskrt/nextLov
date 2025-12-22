import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoBanner from "@/components/PromoBanner";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

import SuccessToastHandler from "@/components/SuccessToastHandler";
import HowItWorks from "@/components/HowItWorks";
import CustomerReviews from "@/components/CustomerReviews";
import PricingHighlight from "@/components/PricingHighlight";
import WhyChooseUs from "@/components/WhyChooseUs";
import GarageService from "@/components/GarageService";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import { getAllPosts } from "@/lib/blog";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense>
        <SuccessToastHandler />
      </Suspense>
      <Header />
      <main className="flex-grow pt-20">
        <Hero />
        <PromoBanner />
        <HowItWorks />
        <WhyChooseUs />
        <Features />
        <GarageService />
        <PricingHighlight />
        <LatestBlogPosts posts={posts} />
        <CustomerReviews />
      </main>
      <Footer />
    </div>
  );
}
