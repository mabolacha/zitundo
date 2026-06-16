import { useState, useEffect } from 'react';

const STORAGE_KEY = 'zitundo_cookie_consent';
const EXPIRY_MS = 13 * 30 * 24 * 60 * 60 * 1000;

export interface ConsentState {
  /** true une fois le localStorage lu — évite les flash côté client */
  loaded: boolean;
  essential: boolean;
  affiliation: boolean;
  analytics: boolean;
}

function readFromStorage(): Omit<ConsentState, 'loaded'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { essential: true, affiliation: false, analytics: false };
    const data = JSON.parse(raw);
    if (Date.now() - data.timestamp > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return { essential: true, affiliation: false, analytics: false };
    }
    return {
      essential: true,
      affiliation: !!data.affiliation,
      analytics: !!data.analytics,
    };
  } catch {
    return { essential: true, affiliation: false, analytics: false };
  }
}

/**
 * Expose l'état de consentement cookies en temps réel.
 *
 * - `loaded` est false au premier rendu (avant lecture du localStorage).
 *   Ne conditionner le chargement de scripts qu'une fois `loaded === true`.
 * - Réagit aux changements dans le même onglet (event `zitundo:consent-updated`)
 *   et dans les autres onglets (event `storage`).
 *
 * Usage :
 *   const { loaded, analytics, affiliation } = useConsent();
 *   useEffect(() => {
 *     if (!loaded || !analytics) return;
 *     loadGoogleAnalytics('G-XXXXXXXXXX');
 *   }, [loaded, analytics]);
 */
export function useConsent(): ConsentState {
  const [state, setState] = useState<ConsentState>({
    loaded: false,
    essential: true,
    affiliation: false,
    analytics: false,
  });

  useEffect(() => {
    // Lecture initiale
    setState({ loaded: true, ...readFromStorage() });

    // Mise à jour dans le même onglet (depuis CookieConsent.tsx)
    const handleSameTab = (e: Event) => {
      const { affiliation, analytics } = (e as CustomEvent<{ affiliation: boolean; analytics: boolean }>).detail;
      setState({ loaded: true, essential: true, affiliation, analytics });
    };

    // Mise à jour depuis un autre onglet
    const handleCrossTab = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setState({ loaded: true, ...readFromStorage() });
      }
    };

    window.addEventListener('zitundo:consent-updated', handleSameTab);
    window.addEventListener('storage', handleCrossTab);
    return () => {
      window.removeEventListener('zitundo:consent-updated', handleSameTab);
      window.removeEventListener('storage', handleCrossTab);
    };
  }, []);

  return state;
}
