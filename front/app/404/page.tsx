"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page non trouvée</p>
        <Link href="/" className="text-primary-red-500 hover:text-primary-red-700 underline inline-flex items-center gap-2">
          <HomeIcon size={16} />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
