import { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GitCompare, Building2, Zap, ArrowLeft, X, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import type { Filters, Offer, OfferCategory } from '../../types';
import FiltersPanel from './Filters';
import OfferCard from './OfferCard';
import CompareTable from './CompareTable';

const DEFAULT_FILTERS: Filters = {
  technology: 'all',
  maxPrice: 100,
  minDownload: 0,
  operator: 'all',
  hasTV: false,
  hasPhone: false,
};

interface ComparateurProps {
  initialCompare?: string[];
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <h2 className="font-display font-bold text-primary uppercase text-lg">{title}</h2>
          <span className="badge badge-muted">{count} offre{count !== 1 ? 's' : ''}</span>
        </div>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      <div className="flex-1 h-px bg-border/40 ml-2" />
    </div>
  );
}

function OfferCardSkeleton() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-border rounded" />
          <div className="h-5 w-36 bg-border rounded" />
          <div className="h-5 w-14 bg-border rounded-full" />
        </div>
        <div className="space-y-1.5 shrink-0">
          <div className="h-8 w-20 bg-border rounded ml-auto" />
          <div className="h-3 w-16 bg-border rounded ml-auto" />
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="flex-1 h-14 bg-border rounded-lg" />
        <div className="flex-1 h-14 bg-border rounded-lg" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-24 bg-border rounded-full" />
        <div className="h-5 w-20 bg-border rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 bg-border rounded" />
        ))}
      </div>
      <div className="border-t border-border pt-3 flex gap-2">
        <div className="flex-1 h-8 bg-border rounded-xl" />
        <div className="flex-1 h-8 bg-border rounded-xl" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Comparateur({ initialCompare = [] }: ComparateurProps) {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [compareIds, setCompareIds] = useState<string[]>(initialCompare);
  const [compareMode, setCompareMode] = useState(false);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Offer[]>('/api/offres');
      setOffers(data);
    } catch {
      setError("Impossible de charger les offres. Vérifiez que le serveur backend est démarré.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      if (filters.technology !== 'all' && o.technology !== filters.technology) return false;
      if (o.promoPrice > filters.maxPrice) return false;
      if (o.downloadSpeed < filters.minDownload) return false;
      if (filters.operator !== 'all' && o.operator !== filters.operator) return false;
      if (filters.hasTV && !o.hasTV) return false;
      if (filters.hasPhone && !o.hasFixedPhone && !o.hasMobilePhone) return false;
      return true;
    });
  }, [filters, offers]);

  const filteredPurePlayers = useMemo(
    () => filtered.filter((o) => o.categorie === 'pure-player'),
    [filtered]
  );
  const filteredLowCost = useMemo(
    () => filtered.filter((o) => o.categorie === 'low-cost'),
    [filtered]
  );

  const activeCategory = useMemo<OfferCategory | null>(() => {
    if (compareIds.length === 0) return null;
    const first = offers.find((o) => o.id === compareIds[0]);
    return first?.categorie ?? null;
  }, [compareIds, offers]);

  const compareOffers = useMemo(
    () => offers.filter((o) => compareIds.includes(o.id)),
    [compareIds, offers]
  );

  const handleFiltersChange = useCallback((f: Filters) => setFilters(f), []);

  const toggleCompare = useCallback(
    (id: string) => {
      const offer = offers.find((o) => o.id === id);
      if (!offer) return;
      setCompareIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 4) return prev;
        if (activeCategory && offer.categorie !== activeCategory) return prev;
        return [...prev, id];
      });
    },
    [activeCategory, offers]
  );

  const removeFromCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      const next = prev.filter((x) => x !== id);
      if (next.length < 2) setCompareMode(false);
      return next;
    });
  }, []);

  const handleSimulate = useCallback(
    (offer: Offer) => navigate(`/simulateur?offer=${offer.id}`),
    [navigate]
  );

  const enterCompareMode = useCallback(() => setCompareMode(true), []);
  const exitCompareMode = useCallback(() => setCompareMode(false), []);
  const clearSelection = useCallback(() => {
    setCompareIds([]);
    setCompareMode(false);
  }, []);

  const renderGrid = (list: Offer[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <AnimatePresence mode="sync">
        {list.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            selected={compareIds.includes(offer.id)}
            compareCount={compareIds.length}
            activeCategory={activeCategory}
            onToggleCompare={toggleCompare}
            onSimulate={handleSimulate}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 text-center space-y-4"
      >
        <AlertCircle className="w-10 h-10 text-error mx-auto" />
        <div>
          <p className="font-semibold text-foreground mb-1">Erreur de chargement</p>
          <p className="text-sm text-muted">{error}</p>
        </div>
        <button onClick={fetchOffers} className="btn-primary text-sm py-2 px-5 mx-auto">
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {compareMode ? (
        /* ── MODE COMPARAISON ── */
        <motion.div
          key="compare-mode"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <div
            className="glass-card px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-primary/35"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <GitCompare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">
                  Mode comparaison
                  <span className="ml-2 badge badge-primary">{compareOffers.length} offres</span>
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {compareOffers.map((o) => o.brand).join(' · ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={exitCompareMode} className="btn-secondary text-sm py-2 px-4">
                <ArrowLeft className="w-4 h-4" />
                Modifier la sélection
              </button>
              <button
                onClick={clearSelection}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted hover:text-error hover:bg-error/10 border border-border/40 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Tout effacer
              </button>
            </div>
          </div>

          <CompareTable offers={compareOffers} onRemove={removeFromCompare} />
        </motion.div>
      ) : (
        /* ── MODE LISTE ── */
        <motion.div
          key="list-mode"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <FiltersPanel filters={filters} onChange={handleFiltersChange} />

          {loading ? (
            <>
              <div className="h-5 w-32 bg-border rounded animate-pulse" />
              <SkeletonGrid />
            </>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-muted">
                  <span className="text-foreground font-semibold">{filtered.length}</span>{' '}
                  offre{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
                  {compareIds.length > 0 && (
                    <span className="ml-3 text-primary">
                      • {compareIds.length} sélectionnée{compareIds.length > 1 ? 's' : ''} pour comparaison
                      {activeCategory && (
                        <span className="ml-1 text-primary/70">
                          ({activeCategory === 'pure-player' ? 'opérateurs historiques' : 'low-cost'})
                        </span>
                      )}
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  {compareIds.length >= 1 && (
                    <button
                      onClick={clearSelection}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-muted hover:text-error hover:bg-error/10 border border-border/40 transition-all duration-200"
                    >
                      <X className="w-3.5 h-3.5" />
                      Effacer ({compareIds.length})
                    </button>
                  )}
                  {compareIds.length >= 2 && (
                    <button onClick={enterCompareMode} className="btn-primary text-sm py-2 px-4">
                      <GitCompare className="w-4 h-4" />
                      Voir le tableau comparatif
                    </button>
                  )}
                </div>
              </div>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="glass-card p-12 text-center">
                  <p className="text-muted text-lg mb-2">Aucune offre ne correspond à vos filtres</p>
                  <p className="text-muted/60 text-sm">Essayez d'assouplir vos critères de recherche</p>
                </div>
              )}

              {/* Section : Opérateurs historiques */}
              {filteredPurePlayers.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionHeader
                    icon={Building2}
                    title="Opérateurs historiques"
                    subtitle="Orange, Free, SFR, Bouygues Telecom — réseau propre, SAV dédié"
                    count={filteredPurePlayers.length}
                  />
                  {renderGrid(filteredPurePlayers)}
                </motion.section>
              )}

              {/* Section : Marques low-cost */}
              {filteredLowCost.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <SectionHeader
                    icon={Zap}
                    title="Marques low-cost"
                    subtitle="Sosh, RED by SFR, B&You — sans engagement, prix réduits, réseau mutualisé"
                    count={filteredLowCost.length}
                  />
                  {renderGrid(filteredLowCost)}
                </motion.section>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
