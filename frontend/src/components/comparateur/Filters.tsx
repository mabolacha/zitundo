import { useState, useCallback } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Filters, Technology } from '../../types';

interface FiltersProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const TECHNOLOGIES: { value: Technology | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'Fibre', label: 'Fibre' },
  { value: 'ADSL', label: 'ADSL' },
];

const MAX_PRICES = [20, 30, 40, 50, 60, 100];
const MIN_SPEEDS = [0, 100, 500, 1000, 5000];

export default function Filters({ filters, onChange }: FiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const set = useCallback(
    <K extends keyof Filters>(key: K, val: Filters[K]) => {
      onChange({ ...filters, [key]: val });
    },
    [filters, onChange]
  );

  const hasActiveFilters =
    filters.technology !== 'all' ||
    filters.maxPrice < 100 ||
    filters.minDownload > 0 ||
    filters.operator !== 'all' ||
    filters.hasTV ||
    filters.hasPhone;

  const reset = useCallback(() => {
    onChange({
      technology: 'all',
      maxPrice: 100,
      minDownload: 0,
      operator: 'all',
      hasTV: false,
      hasPhone: false,
    });
  }, [onChange]);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Filtres
          {hasActiveFilters && <span className="badge badge-accent text-xs">actifs</span>}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-muted hover:text-error transition-colors"
            >
              <X className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="sm:hidden flex items-center gap-1 text-sm font-medium text-primary border border-primary/30 rounded-lg px-2.5 py-1.5 min-h-[36px]"
          >
            {mobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {mobileOpen ? 'Fermer' : 'Afficher'}
          </button>
        </div>
      </div>

      <div className={mobileOpen ? 'block mt-4' : 'hidden sm:block sm:mt-4'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Technologie */}
        <div className="xl:col-span-1">
          <label className="block text-xs text-muted mb-2 font-medium">Technologie</label>
          <div className="flex flex-wrap gap-1.5">
            {TECHNOLOGIES.map((t) => (
              <button
                key={t.value}
                onClick={() => set('technology', t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filters.technology === t.value
                    ? 'bg-primary text-white'
                    : 'bg-card-hover text-muted hover:text-foreground border border-border hover:border-primary/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prix max */}
        <div>
          <label className="block text-xs text-muted mb-2 font-medium">
            Prix max : <span className="text-primary">{filters.maxPrice === 100 ? 'illimité' : `${filters.maxPrice}€/mois`}</span>
          </label>
          <input
            type="range"
            min={15}
            max={100}
            step={5}
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>15€</span>
            <span>100€</span>
          </div>
        </div>

        {/* Débit min */}
        <div>
          <label className="block text-xs text-muted mb-2 font-medium">
            Débit min : <span className="text-primary">{filters.minDownload === 0 ? 'tout' : `${filters.minDownload} Mbps`}</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MIN_SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => set('minDownload', s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filters.minDownload === s
                    ? 'bg-primary text-white'
                    : 'bg-card-hover text-muted hover:text-foreground border border-border hover:border-primary/40'
                }`}
              >
                {s === 0 ? 'Tout' : s >= 1000 ? `${s / 1000} Gb` : `${s}`}
              </button>
            ))}
          </div>
        </div>

        {/* Opérateur */}
        <div>
          <label className="block text-xs text-muted mb-2 font-medium">Opérateur</label>
          <div className="relative">
            <select
              value={filters.operator}
              onChange={(e) => set('operator', e.target.value)}
              className="input-field py-2 text-sm appearance-none pr-8"
            >
              <option value="all">Tous les opérateurs</option>
              <option value="Orange">Orange</option>
              <option value="Free">Free</option>
              <option value="SFR">SFR</option>
              <option value="Bouygues">Bouygues</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>
        </div>

        {/* Services */}
        <div className="xl:col-span-2">
          <label className="block text-xs text-muted mb-2 font-medium">Services inclus</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.hasTV}
                onChange={(e) => set('hasTV', e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-muted group-hover:text-foreground transition-colors">📺 TV incluse</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.hasPhone}
                onChange={(e) => set('hasPhone', e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-muted group-hover:text-foreground transition-colors">📞 Téléphonie</span>
            </label>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
