import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

import SuccessToastHandler from "@/components/SuccessToastHandler";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SuccessToastHandler />
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
