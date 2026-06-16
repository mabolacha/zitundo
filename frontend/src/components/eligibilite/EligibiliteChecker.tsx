import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, CheckCircle, Wifi, AlertCircle, Loader2 } from 'lucide-react';
import type { EligibilityResult } from '../../types';

const NRO_LIST = [
  'Paris-Bastille', 'Lyon-Brotteaux', 'Marseille-Noailles', 'Bordeaux-Meriadeck',
  'Nantes-Chantenay', 'Strasbourg-Neudorf', 'Toulouse-Mirail', 'Nice-Riquier',
  'Rennes-Villejean', 'Montpellier-Antigone', 'Lille-Moulins', 'Grenoble-Eaux-Claires',
];

const OPERATORS_FIBER = ['Orange', 'Free', 'SFR', 'Bouygues Telecom'];
const OPERATORS_ADSL = ['Orange', 'SFR', 'Bouygues Telecom'];

function simulateEligibility(address: string): EligibilityResult {
  const hash = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hasFiber = hash % 3 !== 0;
  const nroIndex = hash % NRO_LIST.length;
  const maxSpeed = hasFiber ? [500, 1000, 2000, 10000][hash % 4] : 20;

  return {
    address,
    hasFiber,
    hasADSL: true,
    nro: NRO_LIST[nroIndex],
    maxSpeed,
    availableOperators: hasFiber ? OPERATORS_FIBER : OPERATORS_ADSL,
  };
}

function isValidFrenchAddress(address: string): boolean {
  const trimmed = address.trim();
  if (trimmed.length < 10) return false;
  const hasNumber = /\d/.test(trimmed);
  const hasCity = trimmed.split(' ').length >= 3;
  return hasNumber && hasCity;
}

export default function EligibiliteChecker() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = useCallback(async () => {
    setError(null);
    if (!isValidFrenchAddress(address)) {
      setError('Veuillez saisir une adresse complète (ex: 15 rue de la Paix, 75001 Paris)');
      return;
    }
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    setResult(simulateEligibility(address));
    setLoading(false);
  }, [address]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleCheck();
    },
    [handleCheck]
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Input */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-foreground text-lg">Vérifier l'éligibilité</h2>
        </div>

        <p className="text-sm text-muted">
          Entrez votre adresse complète pour vérifier les technologies disponibles et les opérateurs éligibles à votre domicile.
        </p>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setError(null); }}
              onKeyDown={handleKeyDown}
              placeholder="15 rue de la Paix, 75001 Paris"
              className="input-field pl-9"
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading}
            className="btn-primary shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Vérifier
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-error rounded-xl p-3 bg-error/[0.08] border border-error/20"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-8 text-center space-y-3"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-muted text-sm">Interrogation du réseau fibre optique…</p>
            <div className="flex gap-2 justify-center">
              {['Recherche NRO', 'Vérif. déploiement', 'Analyse opérateurs'].map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.4 }}
                  className="badge badge-muted"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Main status */}
            <div
              className={`glass-card p-6 ${result.hasFiber ? 'border-primary/40' : 'border-warning/40'}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    result.hasFiber ? 'bg-primary/10' : 'bg-warning/10'
                  }`}
                >
                  {result.hasFiber ? (
                    <Wifi className="w-6 h-6 text-primary" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-xl mb-1">
                    {result.hasFiber ? (
                      <span className="text-gradient">Fibre optique disponible !</span>
                    ) : (
                      'Fibre non disponible à cette adresse'
                    )}
                  </h3>
                  <p className="text-muted text-sm">
                    Adresse analysée : <span className="text-foreground">{result.address}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <div className={`text-2xl font-display font-bold mb-1 ${result.hasFiber ? 'text-primary' : 'text-muted'}`}>
                  {result.hasFiber ? 'Fibre' : '—'}
                </div>
                <div className="text-xs text-muted">Fibre FTTH</div>
                <div className="flex justify-center mt-2">
                  {result.hasFiber ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-muted" />
                  )}
                </div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-display font-bold text-foreground mb-1">ADSL</div>
                <div className="text-xs text-muted">Disponible</div>
                <div className="flex justify-center mt-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-display font-bold text-primary mb-1">
                  {result.maxSpeed! >= 1000
                    ? `${result.maxSpeed! / 1000} Gb/s`
                    : `${result.maxSpeed} Mb/s`}
                </div>
                <div className="text-xs text-muted">Débit max disponible</div>
              </div>
            </div>

            {/* NRO */}
            {result.nro && (
              <div
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted">NRO (Nœud de Raccordement Optique) le plus proche</p>
                  <p className="font-semibold text-foreground">{result.nro}</p>
                </div>
              </div>
            )}

            {/* Available operators */}
            <div className="glass-card p-5">
              <h4 className="font-semibold text-foreground mb-3 text-sm">
                Opérateurs éligibles ({result.availableOperators.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.availableOperators.map((op) => (
                  <span key={op} className="badge badge-primary text-sm px-3 py-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {op}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-5 text-center space-y-3 border border-border bg-card-hover">
              <p className="text-foreground font-semibold">
                {result.hasFiber
                  ? 'Profitez de la fibre ! Comparez les offres disponibles.'
                  : 'Comparez les meilleures offres ADSL disponibles.'}
              </p>
              <a href="/comparer" className="btn-primary inline-flex">
                Voir les offres disponibles
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
