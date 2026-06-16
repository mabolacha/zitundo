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
    // Remplace G-XXXXXXXXXX par ton Measurement ID
    //
    // const script = document.createElement('script');
    // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    // script.async = true;
    // document.head.appendChild(script);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(...args: unknown[]) { window.dataLayer.push(args); }
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });

    // ── Alternative RGPD-native (Plausible, Matomo cloud) ───────────────────
    // Plausible ne dépose pas de cookies → peut se passer du consentement,
    // mais on le conditionne quand même par cohérence et bonne pratique.
    //
    // const script = document.createElement('script');
    // script.defer = true;
    // script.dataset.domain = 'zitundo.com';
    // script.src = 'https://plausible.io/js/script.js';
    // document.head.appendChild(script);

    console.info('[Zitundo] Analytics activés (consentement reçu)');
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
