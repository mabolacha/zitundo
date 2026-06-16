import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronDown, Info, TrendingDown, HelpCircle, X, RefreshCw } from 'lucide-react';
import type { Offer, TCOResult } from '../../types';

const DURATION = 24;

function computeTCO(offer: Offer, withTermination: boolean): TCOResult {
  const promoMonths = Math.min(offer.promoDuration, DURATION);
  const regularMonths = DURATION - promoMonths;

  const promoCost = offer.promoPrice * promoMonths;
  const regularCost = offer.regularPrice * regularMonths;
  const modemCost = offer.modemRental * DURATION;
  const terminationFee = withTermination ? offer.terminationFee : 0;

  const total =
    promoCost +
    regularCost +
    offer.installationFee +
    offer.activationFee +
    modemCost +
    terminationFee;

  return {
    offerId: offer.id,
    offerName: `${offer.brand} – ${offer.name}`,
    promoCost,
    regularCost,
    installationFee: offer.installationFee,
    activationFee: offer.activationFee,
    modemCost,
    terminationFee,
    total,
    monthlySmoothed: total / DURATION,
  };
}

interface SimulateurTCOProps {
  preselectedId?: string | null;
}

export default function SimulateurTCO({ preselectedId }: SimulateurTCOProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [withTermination, setWithTermination] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Offer[]>('/api/offres');
      setOffers(data);
      const initial = preselectedId && data.find((o) => o.id === preselectedId)
        ? preselectedId
        : data[0]?.id ?? '';
      setSelectedId(initial);
    } catch {
      setError('Impossible de charger les offres. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const offer = useMemo(() => offers.find((o) => o.id === selectedId), [offers, selectedId]);
  const tco = useMemo(() => offer ? computeTCO(offer, withTermination) : null, [offer, withTermination]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 h-52 animate-pulse bg-card-hover" />
        <div className="glass-card p-6 h-72 animate-pulse bg-card-hover" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <p className="text-muted">{error}</p>
        <button onClick={fetchOffers} className="btn-primary mx-auto">
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    );
  }

  if (!offer || !tco) return null;

  const rows: { label: string; value: number; accent?: boolean }[] = [
    { label: `Mensualités promo (${Math.min(offer.promoDuration, DURATION)} mois × ${offer.promoPrice.toFixed(2)}€)`, value: tco.promoCost },
    ...(tco.regularCost > 0
      ? [{ label: `Mensualités régulières (${DURATION - Math.min(offer.promoDuration, DURATION)} mois × ${offer.regularPrice.toFixed(2)}€)`, value: tco.regularCost }]
      : []),
    { label: 'Frais d\'installation', value: tco.installationFee },
    { label: 'Frais d\'activation', value: tco.activationFee },
    { label: `Location box (${DURATION} mois × ${offer.modemRental}€)`, value: tco.modemCost },
    ...(withTermination && tco.terminationFee > 0
      ? [{ label: 'Frais de résiliation', value: tco.terminationFee, accent: true }]
      : []),
  ];

  const progress = (n: number) => Math.round((n / tco.total) * 100);

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-foreground text-lg">Paramètres de simulation</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-2">Offre à simuler</label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="input-field pr-10 appearance-none"
            >
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.logo} {o.brand} – {o.name} ({o.promoPrice.toFixed(2)}€/mois)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={withTermination}
            onChange={(e) => setWithTermination(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-muted group-hover:text-foreground transition-colors">
            Inclure les frais de résiliation actuels ({offer.terminationFee}€)
          </span>
          <Info className="w-4 h-4 text-muted/50" />
        </label>

        <div className="rounded-xl p-3 text-xs text-muted flex items-start gap-2 bg-primary/5 border border-primary/20">
          <Info className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
          <span>
            <strong className="text-primary">Formule coût réel sur 24 mois</strong> = (Prix promo × mois_promo) + (Prix régulier × mois_restants) + Frais d'installation + Frais d'activation + (Location box × 24) + Frais de résiliation
          </span>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId + withTermination}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-6 space-y-5"
        >
          {/* Hero result */}
          <div className="text-center py-4">
            <p className="text-sm text-muted mb-1">Coût réel sur {DURATION} mois</p>
            <div className="font-display font-bold text-5xl text-gradient mb-1">
              {tco.total.toFixed(2)}€
            </div>
            <div className="flex justify-center">
              <div className="badge badge-primary text-sm px-4 py-2 mt-2">
                <TrendingDown className="w-4 h-4" />
                Coût Réel Mensuel Lissé :{' '}
                <strong className="ml-1 text-base">{tco.monthlySmoothed.toFixed(2)}€/mois</strong>
              </div>
            </div>

            {/* Pourquoi 24 mois */}
            <div className="mt-3 flex flex-col items-center">
              <button
                onClick={() => setShowWhy((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary underline underline-offset-2 decoration-dotted transition-colors duration-200"
                aria-expanded={showWhy}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Pourquoi 24 mois ?
              </button>

              <AnimatePresence>
                {showWhy && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 rounded-2xl p-4 text-left max-w-sm w-full relative bg-card border border-border shadow-md"
                  >
                    <button
                      onClick={() => setShowWhy(false)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                      aria-label="Fermer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-semibold text-foreground">Pourquoi 24 mois ?</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      24 mois est la durée de référence utilisée pour comparer les offres équitablement.
                      Les promotions durent souvent 12 mois, suivies du tarif plein. Calculer sur 24 mois
                      permet de comparer deux offres ayant des durées de promo différentes en intégrant
                      leur coût réel sur une période assez longue pour lisser l'effet promo.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Détail des coûts</h3>
            {rows.map((row) =>
              row.value === 0 ? null : (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={row.accent ? 'text-warning' : 'text-muted'}>{row.label}</span>
                    <span className={`font-semibold ${row.accent ? 'text-warning' : 'text-foreground'}`}>
                      {row.value.toFixed(2)}€
                    </span>
                  </div>
                  <div className="w-full rounded-full h-1.5 bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress(row.value)}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className={`h-1.5 rounded-full ${row.accent ? 'bg-warning' : 'bg-primary'}`}
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {/* Comparison hint */}
          <div className="rounded-xl p-4 text-sm bg-card-hover border border-border">
            <p className="text-muted">
              <span className="text-primary font-semibold">{offer.brand} – {offer.name}</span> vous coûte en moyenne{' '}
              <span className="text-foreground font-bold">{tco.monthlySmoothed.toFixed(2)}€/mois</span> sur 2 ans,
              {offer.promoDuration > 0
                ? ` contre ${offer.promoPrice.toFixed(2)}€/mois affiché en promo.`
                : ' sans variation de prix.'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
