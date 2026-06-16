import { motion } from 'framer-motion';
import { X, Check, Minus } from 'lucide-react';
import type { Offer } from '../../types';

interface CompareTableProps {
  offers: Offer[];
  onRemove: (id: string) => void;
}

type Row = {
  label: string;
  key: keyof Offer | 'speeds' | 'fees' | 'promo';
  render: (o: Offer) => React.ReactNode;
};

const ROWS: Row[] = [
  {
    label: 'Technologie',
    key: 'technology',
    render: (o) => (
      <span className={`badge ${o.technology === 'Fibre' ? 'badge-primary' : 'badge-muted'}`}>
        {o.technology}
      </span>
    ),
  },
  {
    label: 'Prix promo',
    key: 'promoPrice',
    render: (o) => (
      <span className="font-display font-bold text-lg text-primary-dark">
        {o.promoPrice.toFixed(2)}€<span className="text-xs font-normal text-muted">/mois</span>
      </span>
    ),
  },
  {
    label: 'Prix régulier',
    key: 'regularPrice',
    render: (o) => <span className="text-sm text-muted">{o.regularPrice.toFixed(2)}€/mois</span>,
  },
  {
    label: 'Durée promo',
    key: 'promoDuration',
    render: (o) =>
      o.promoDuration > 0 ? (
        <span className="badge badge-accent">{o.promoDuration} mois</span>
      ) : (
        <span className="badge badge-success">Prix fixe</span>
      ),
  },
  {
    label: 'Débit descendant',
    key: 'downloadSpeed',
    render: (o) => {
      const best = true;
      return (
        <span className="font-display font-bold text-primary">
          {o.downloadSpeed >= 1000 ? `${o.downloadSpeed / 1000} Gb/s` : `${o.downloadSpeed} Mb/s`}
        </span>
      );
    },
  },
  {
    label: 'Débit montant',
    key: 'uploadSpeed',
    render: (o) => (
      <span className="font-semibold text-muted">
        {o.uploadSpeed >= 1000 ? `${o.uploadSpeed / 1000} Gb/s` : `${o.uploadSpeed} Mb/s`}
      </span>
    ),
  },
  {
    label: 'Frais d\'installation',
    key: 'installationFee',
    render: (o) =>
      o.installationFee === 0 ? (
        <span className="text-success flex items-center gap-1"><Check className="w-3.5 h-3.5" />Offerts</span>
      ) : (
        <span className="text-foreground">{o.installationFee}€</span>
      ),
  },
  {
    label: 'Frais d\'activation',
    key: 'activationFee',
    render: (o) =>
      o.activationFee === 0 ? (
        <span className="text-success flex items-center gap-1"><Check className="w-3.5 h-3.5" />Offerts</span>
      ) : (
        <span className="text-foreground">{o.activationFee}€</span>
      ),
  },
  {
    label: 'Location box/mois',
    key: 'modemRental',
    render: (o) =>
      o.modemRental === 0 ? (
        <span className="text-success flex items-center gap-1"><Check className="w-3.5 h-3.5" />Incluse</span>
      ) : (
        <span className="text-foreground">+{o.modemRental}€/mois</span>
      ),
  },
  {
    label: 'Frais de résiliation',
    key: 'terminationFee',
    render: (o) =>
      o.terminationFee === 0 ? (
        <span className="text-success flex items-center gap-1"><Check className="w-3.5 h-3.5" />Gratuits</span>
      ) : (
        <span className="text-muted">{o.terminationFee}€</span>
      ),
  },
  {
    label: 'Engagement',
    key: 'commitment',
    render: (o) =>
      o.commitment === 0 ? (
        <span className="badge badge-success">Sans engagement</span>
      ) : (
        <span className="badge badge-muted">{o.commitment} mois</span>
      ),
  },
  {
    label: 'TV incluse',
    key: 'hasTV',
    render: (o) =>
      o.hasTV ? (
        <span className="text-success flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          {o.tvChannels ? `${o.tvChannels} chaînes` : 'Oui'}
        </span>
      ) : (
        <Minus className="w-4 h-4 text-muted" />
      ),
  },
  {
    label: 'Téléphonie fixe',
    key: 'hasFixedPhone',
    render: (o) =>
      o.hasFixedPhone ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        <Minus className="w-4 h-4 text-muted" />
      ),
  },
  {
    label: 'Mobile inclus',
    key: 'hasMobilePhone',
    render: (o) =>
      o.hasMobilePhone ? (
        <span className="text-success flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          {o.mobileData}
        </span>
      ) : (
        <Minus className="w-4 h-4 text-muted" />
      ),
  },
];

export default function CompareTable({ offers, onRemove }: CompareTableProps) {
  if (offers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-4 border-b border-border/40">
        <h3 className="font-display font-bold text-foreground">
          Comparaison côte à côte{' '}
          <span className="text-primary">({offers.length} offres)</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted w-44">Critère</th>
              {offers.map((o) => (
                <th key={o.id} className="px-4 py-3 text-center min-w-[160px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{o.logo}</span>
                      <span className="text-sm font-bold text-foreground">{o.brand}</span>
                      <button
                        onClick={() => onRemove(o.id)}
                        className="ml-1 p-0.5 rounded text-muted hover:text-error hover:bg-error/10 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-muted">{o.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, idx) => (
              <tr
                key={row.label}
                className={`border-b border-border/50 ${idx % 2 === 0 ? 'bg-card-hover/50' : ''}`}
              >
                <td className="px-4 py-3 text-xs text-muted">{row.label}</td>
                {offers.map((o) => (
                  <td key={o.id} className="px-4 py-3 text-center text-sm">
                    {row.render(o)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
