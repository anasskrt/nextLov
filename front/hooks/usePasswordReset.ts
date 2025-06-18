import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

interface UsePasswordResetReturn {
  resetPassword: (data: ResetPasswordData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetPassword = async (data: ResetPasswordData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          throw new Error("Ce lien n'est plus valide. Demandez un nouveau lien.");
        }
        throw new Error('Une erreur est survenue. Veuillez réessayer.');
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a bien été défini. Vous pouvez vous connecter.",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
    error,
  };
};