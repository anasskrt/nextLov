import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

import SuccessToastHandler from "@/components/SuccessToastHandler";
import HowItWorks from "@/components/HowItWorks";
import CustomerReviews from "@/components/CustomerReviews";
import PricingHighlight from "@/components/PricingHighlight";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SuccessToastHandler />
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <PricingHighlight />
        <CustomerReviews />
      </main>
      <Footer />
    </div>
  );
}
