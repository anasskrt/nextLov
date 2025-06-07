'use client';

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const SuccessToastHandler = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Votre demande a été enregistrée avec succès");

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [searchParams]);

  return null;
};

export default SuccessToastHandler;
