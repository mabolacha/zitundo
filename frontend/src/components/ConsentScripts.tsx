import { useEffect, useRef } from 'react';
import { useConsent } from '../hooks/useConsent';

/**
 * Charge les scripts tiers uniquement après consentement explicite.
 * Ajouter ce composant une seule fois dans App.tsx (déjà fait).
 *
 * Pour brancher un outil réel, décommente et complète la section correspondante.
 */
export default function ConsentScripts() {
  const { loaded, analytics, affiliation } = useConsent();
  const analyticsLoaded = useRef(false);
  const affiliationLoaded = useRef(false);

  // ─── Analytics ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded || !analytics || analyticsLoaded.current) return;
    analyticsLoaded.current = true;

    // ── Google Analytics 4 ──────────────────────────────────────────────────
    // Si index.html a déjà chargé GA4 (visiteur de retour avec consentement),
    // window.gtag est défini — on ne recharge pas.
    if (!(window as any).gtag) {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-SN475MDZ82';
      script.async = true;
      document.head.appendChild(script);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function (...args: unknown[]) { (window as any).dataLayer.push(args); };
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', 'G-SN475MDZ82', { anonymize_ip: true });
    }

    console.info('[Zitundo] Analytics GA4 activés (consentement reçu)');
  }, [loaded, analytics]);

  // ─── Affiliation ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded || !affiliation || affiliationLoaded.current) return;
    affiliationLoaded.current = true;

    // ── Script partenaire (ex: Awin, Tradedoubler, Commission Junction) ──────
    // Remplace par l'URL fournie par ton réseau d'affiliation
    //
    // const script = document.createElement('script');
    // script.src = 'https://www.example-affiliate-network.com/track.js';
    // script.async = true;
    // document.head.appendChild(script);

    console.info('[Zitundo] Affiliation activée (consentement reçu)');
  }, [loaded, affiliation]);

  // Ce composant ne rend rien — il injecte des scripts dans <head>
  return null;
}
