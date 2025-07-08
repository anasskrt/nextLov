import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

import SuccessToastHandler from "@/components/SuccessToastHandler";
import HowItWorks from "@/components/HowItWorks";
import CustomerReviews from "@/components/CustomerReviews";
import PricingHighlight from "@/components/PricingHighlight";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense>
        <SuccessToastHandler />
      </Suspense>
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <WhyChooseUs />
        <Features />
        <PricingHighlight />
        <CustomerReviews />
      </main>
      <Footer />
    </div>
  );
}
