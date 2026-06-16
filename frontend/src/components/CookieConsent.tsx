import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, BarChart3, Link2 } from 'lucide-react';

const STORAGE_KEY = 'zitundo_cookie_consent';
const EXPIRY_MS = 13 * 30 * 24 * 60 * 60 * 1000; // 13 mois CNIL

interface ConsentData {
  essential: true;
  affiliation: boolean;
  analytics: boolean;
  timestamp: number;
}

function loadConsent(): ConsentData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: ConsentData = JSON.parse(raw);
    if (Date.now() - data.timestamp > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveConsent(affiliation: boolean, analytics: boolean) {
  const data: ConsentData = {
    essential: true,
    affiliation,
    analytics,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Notifie useConsent() dans le même onglet
  window.dispatchEvent(
    new CustomEvent('zitundo:consent-updated', { detail: { affiliation, analytics } })
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  id: string;
}

function Toggle({ checked, onChange, disabled, id }: ToggleProps) {
  return (
    <label htmlFor={id} className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => !disabled && onChange(e.target.checked)}
      />
      <div className="w-11 h-6 rounded-full transition-colors bg-border peer-checked:bg-primary
        after:content-[''] after:absolute after:top-0.5 after:left-0.5
        after:bg-white after:rounded-full after:h-5 after:w-5
        after:transition-all after:shadow
        peer-checked:after:translate-x-5" />
    </label>
  );
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [affiliation, setAffiliation] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (!loadConsent()) setVisible(true);

    const handler = () => setShowModal(true);
    window.addEventListener('zitundo:open-cookie-manager', handler);
    return () => window.removeEventListener('zitundo:open-cookie-manager', handler);
  }, []);

  const acceptAll = () => {
    saveConsent(true, true);
    setVisible(false);
    setShowModal(false);
  };

  const rejectAll = () => {
    saveConsent(false, false);
    setVisible(false);
    setShowModal(false);
  };

  const savePrefs = () => {
    saveConsent(affiliation, analytics);
    setVisible(false);
    setShowModal(false);
  };

  return (
    <>
      {/* Bandeau */}
      <AnimatePresence>
        {visible && !showModal && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Cookie className="w-6 h-6 text-accent shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-sm text-muted flex-1 leading-relaxed">
                <span className="font-semibold text-foreground">Zitundo utilise des cookies</span>{' '}
                pour améliorer votre expérience. Les cookies d'affiliation nous permettent de rester gratuits.
              </p>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => { setAffiliation(false); setAnalytics(false); setShowModal(true); }}
                  className="text-xs text-primary/70 hover:text-primary underline underline-offset-2 decoration-dotted transition-colors whitespace-nowrap"
                >
                  Personnaliser
                </button>
                <button onClick={rejectAll} className="btn-secondary text-sm py-2 px-4 whitespace-nowrap">
                  Continuer sans accepter
                </button>
                <button onClick={acceptAll} className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
                  Tout accepter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); } }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-accent" />
                  <h2 className="font-display font-bold text-foreground">Gestion des cookies</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories */}
              <div className="p-5 space-y-4">
                {/* Essentiels */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-primary-light border border-border">
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Cookies essentiels</p>
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">
                        Nécessaires au fonctionnement du site (navigation, préférences). Toujours actifs.
                      </p>
                    </div>
                  </div>
                  <Toggle id="essential" checked={true} onChange={() => {}} disabled />
                </div>

                {/* Affiliation */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-card-hover border border-border">
                  <div className="flex items-start gap-3">
                    <Link2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Cookies d'affiliation</p>
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">
                        Permettent de tracker les souscriptions via nos liens partenaires et de rémunérer Zitundo.
                      </p>
                    </div>
                  </div>
                  <Toggle id="affiliation" checked={affiliation} onChange={setAffiliation} />
                </div>

                {/* Analytiques */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-card-hover border border-border">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Cookies analytiques</p>
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">
                        Nous aident à comprendre comment vous utilisez le site (Google Analytics ou équivalent).
                      </p>
                    </div>
                  </div>
                  <Toggle id="analytics" checked={analytics} onChange={setAnalytics} />
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 border-t border-border">
                <button onClick={rejectAll} className="text-xs text-muted hover:text-foreground underline underline-offset-2 decoration-dotted transition-colors">
                  Tout refuser
                </button>
                <div className="flex gap-2">
                  <button onClick={savePrefs} className="btn-secondary text-sm py-2 px-5">
                    Enregistrer mes préférences
                  </button>
                  <button onClick={acceptAll} className="btn-primary text-sm py-2 px-5">
                    Tout accepter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
