'use client';

import { useEffect, useRef } from 'react';

export interface AbandonedBookingData {
  email: string;
  phone: string;
  firstName: string;
  lastName?: string;
  estimatedPrice?: number;
  departureDate?: string;
  returnDate?: string;
  currentStep: 'services' | 'userinfo' | 'rules' | 'payment';
  selectedServices?: string[];
}

/**
 * Hook pour tracker les abandons de booking
 * Sauvegarde les informations clients si ils quittent sans finaliser
 * 
 * @param bookingData - Les données du booking en cours
 * @param enabled - Activer/désactiver le tracking (par défaut: true)
 */
export const useBookingAbandonmentTracking = (
  bookingData: Partial<AbandonedBookingData>,
  enabled = true
) => {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasTrackedRef.current) return;

    // Vérifier qu'on a au moins email et téléphone pour contacter
    if (!bookingData.email || !bookingData.phone || !bookingData.firstName) {
      console.warn('⚠️ Données manquantes:', {
        hasEmail: !!bookingData.email,
        hasPhone: !!bookingData.phone,
        hasFirstName: !!bookingData.firstName
      });
      return;
    }

    const trackAbandonment = () => {
      if (hasTrackedRef.current) return;
            
      try {
        const dataToSend: Record<string, any> = {
          email: bookingData.email,
          phone: bookingData.phone,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          estimatedPrice: bookingData.estimatedPrice,
          departureDate: bookingData.departureDate,
          returnDate: bookingData.returnDate,
          currentStep: bookingData.currentStep || 'services',
          selectedServices: bookingData.selectedServices,
          abandonedAt: new Date().toISOString(),
        };

        // Utiliser sendBeacon pour une fiabilité maximale
        const blob = new Blob([JSON.stringify(dataToSend)], {
          type: 'application/json',
        });

        const sent = navigator.sendBeacon(`${process.env.BACKEND_URL}/booking/abandonments`, blob);
        
        // Backup: fetch avec keepalive
        if (!sent) {
          fetch(`${process.env.BACKEND_URL}/booking/abandonments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
            keepalive: true,
          }).catch(() => {});
        }
        
        hasTrackedRef.current = true;
      } catch (error) {
        console.error('❌ Erreur tracking:', error);
      }
    };

    // Plusieurs événements pour maximiser les chances
    window.addEventListener('beforeunload', trackAbandonment);
    window.addEventListener('pagehide', trackAbandonment);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackAbandonment();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', trackAbandonment);
      window.removeEventListener('pagehide', trackAbandonment);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [bookingData, enabled]);
};
