// lib/analytics.ts
/**
 * Utilitaires pour le tracking Google Ads et Analytics
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Déclenche une conversion Google Ads
 * @param amount - Montant de la transaction en euros
 * @param transactionId - ID unique de la transaction (ex: Stripe session_id)
 */
export const trackConversion = (
  amount: number = 1.0,
  transactionId: string = ''
): void => {
  // Vérifier que nous sommes côté client
  if (typeof window === 'undefined') {
    console.warn('[Analytics] trackConversion called on server side');
    return;
  }

  // Vérifier si la conversion a déjà été trackée (éviter les doublons)
  const conversionKey = `conversion_tracked_${transactionId}`;
  if (transactionId && sessionStorage.getItem(conversionKey)) {
    console.log('[Analytics] Conversion already tracked for', transactionId);
    return;
  }

  // Vérifier que gtag est chargé
  if (!window.gtag_report_conversion) {
    console.warn('[Analytics] Google Ads conversion tracking not loaded');
    return;
  }

  try {
    // Appeler la fonction de conversion de base
    window.gtag_report_conversion();

    // Envoyer aussi l'événement avec les détails
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-16808260855/7SATCKqYz9MbEPfp5s4-',
        value: amount,
        currency: 'EUR',
        transaction_id: transactionId,
      });
    }

    // Marquer comme tracké
    if (transactionId) {
      sessionStorage.setItem(conversionKey, 'true');
    }

    console.log('[Analytics] Conversion tracked:', { amount, transactionId });
  } catch (error) {
    console.error('[Analytics] Error tracking conversion:', error);
  }
};

/**
 * Track un événement personnalisé Google Analytics
 * @param eventName - Nom de l'événement
 * @param parameters - Paramètres additionnels
 */
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean | undefined>
): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('[Analytics] gtag not available');
    return;
  }

  try {
    window.gtag('event', eventName, parameters);
    console.log('[Analytics] Event tracked:', eventName, parameters);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
};

/**
 * Track le début d'une réservation
 */
export const trackBookingStart = (): void => {
  trackEvent('begin_checkout', {
    event_category: 'booking',
    event_label: 'Booking form started',
  });
};

/**
 * Track l'abandon de panier
 */
export const trackBookingAbandoned = (step: string): void => {
  trackEvent('checkout_abandoned', {
    event_category: 'booking',
    event_label: `Abandoned at ${step}`,
  });
};

/**
 * Track la soumission du formulaire de devis
 */
export const trackQuoteSubmitted = (amount?: number): void => {
  trackEvent('quote_submitted', {
    event_category: 'booking',
    event_label: 'Quote form submitted',
    value: amount,
    currency: 'EUR',
  });
};

/**
 * Track le clic sur le bouton de paiement
 */
export const trackPaymentInitiated = (amount: number): void => {
  trackEvent('payment_initiated', {
    event_category: 'booking',
    event_label: 'Payment button clicked',
    value: amount,
    currency: 'EUR',
  });
};
