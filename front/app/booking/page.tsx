/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
// "use client" supprimé pour permettre l'export de metadata (Server Component)

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceSelection from "@/components/ServiceSelection";
import UserInfoForm from "@/components/UserInfoForm";
import PaymentForm from "@/components/PaymentForm";
import RulesValidation from "@/components/RulesValidation";

type Step = "services" | "userinfo" | "rules" | "payment";

const BookingProcessPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("services");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("bookingDetails");
    if (!stored) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      // ✅ Convertir les dates string en objets Date
      parsed.departureDate = new Date(parsed.fullDepartureDate);
      parsed.returnDate = new Date(parsed.fullReturnDate);

      setBookingDetails(parsed);
    } catch {
      router.push("/");
    }
  }, [router]);

  const handleServiceSelection = (services: any[]) => {
    setSelectedServices(services);
    setCurrentStep("userinfo");
  };

  const handleUserInfoSubmit = (user: any) => {
    setUserInfo(user);
    setCurrentStep("rules");
  };

  const handleRulesValidation = () => {
    setCurrentStep("payment");
  };

  const calculateTotalAmount = () => {
    const montantFinal = bookingDetails?.estimation?.montantFinal ?? 0;

    return montantFinal;
  };

  const stepTitles = {
    services: "Choisissez vos services",
    userinfo: "Vos informations",
    rules: "Validation des règles",
    payment: "Finaliser votre réservation",
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "services":
        return (
          <ServiceSelection
            onNext={handleServiceSelection}
            onBack={() => router.push("/")}
          />
        );
      case "userinfo":
        return (
          <UserInfoForm
            onNext={handleUserInfoSubmit}
            onBack={() => setCurrentStep("services")}
          />
        );
      case "rules":
        return (
          <RulesValidation
            onNext={handleRulesValidation}
            onBack={() => setCurrentStep("userinfo")}
          />
        );
      case "payment":
        return (
          <PaymentForm
            totalAmount={calculateTotalAmount()}
            services={selectedServices}
            userInfo={userInfo}
            bookingDetails={bookingDetails}
            onBack={() => setCurrentStep("rules")}
          />
        );
      default:
        return null;
    }
  };

  if (!bookingDetails) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 pt-20">
        <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Étape actuelle:</span>
              <span className="text-gold font-bold">
                {stepTitles[currentStep]}
              </span>
            </div>
            <div className="flex space-x-2">
              {["services", "userinfo", "rules", "payment"].map((step, index) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded ${
                    ["services", "userinfo", "rules", "payment"].indexOf(currentStep) >=
                    index
                      ? "bg-gold"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          {renderStepContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingProcessPage;
