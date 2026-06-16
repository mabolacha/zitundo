import { motion } from 'framer-motion';
import { Check, Tv, Phone, Smartphone, Zap, ArrowRight, Info, Ban } from 'lucide-react';
import type { Offer, OfferCategory } from '../../types';

interface OfferCardProps {
  offer: Offer;
  selected: boolean;
  compareCount: number;
  activeCategory: OfferCategory | null;
  onToggleCompare: (id: string) => void;
  onSimulate: (offer: Offer) => void;
}

const SFR_NOTICE =
  'Rachat de SFR par Orange, Bouygues et Free prévu pour 2027 (sous réserve de validation réglementaire)';

function speedLabel(mbps: number): string {
  if (mbps >= 1000) return `${mbps / 1000} Gb/s`;
  return `${mbps} Mb/s`;
}

export default function OfferCard({
  offer,
  selected,
  compareCount,
  activeCategory,
  onToggleCompare,
  onSimulate,
}: OfferCardProps) {
  const crossGroupBlocked =
    activeCategory !== null && !selected && offer.categorie !== activeCategory;
  const canSelect = selected || (!crossGroupBlocked && compareCount < 4);
  const savings = offer.regularPrice - offer.promoPrice;
  const isSFRGroup = offer.operator === 'SFR';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`glass-card p-5 flex flex-col gap-4 cursor-default relative overflow-hidden ${
        selected ? 'offer-selected-ring' : ''
      }`}
    >
      {/* Highlight badge */}
      {offer.highlight && (
        <div className="absolute top-0 right-0">
          <div
            className="text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl"
            style={{ background: offer.color, color: '#fff' }}
          >
            {offer.highlight}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{offer.logo}</span>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">{offer.brand}</span>
          </div>
          <h3 className="font-display font-bold text-foreground text-base leading-tight">{offer.name}</h3>
          <span
            className={`badge mt-1 ${offer.technology === 'Fibre' ? 'badge-primary' : 'badge-muted'}`}
          >
            {offer.technology}
          </span>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-2xl text-foreground">
              {offer.promoPrice.toFixed(2)}
            </span>
            <span className="text-xs text-muted">€/mois</span>
          </div>
          {offer.promoDuration > 0 && (
            <div className="text-xs text-muted">
              puis <span className="text-foreground">{offer.regularPrice.toFixed(2)}€</span>
            </div>
          )}
          {savings > 0 && offer.promoDuration > 0 && (
            <div className="badge badge-accent mt-1">
              -{savings.toFixed(0)}€/mois
            </div>
          )}
        </div>
      </div>

      {/* Speeds */}
      <div className="flex gap-3">
        <div className="flex-1 bg-card-hover rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted">Débit ↓</span>
          </div>
          <span className="font-display font-bold text-sm text-foreground">{speedLabel(offer.downloadSpeed)}</span>
        </div>
        <div className="flex-1 bg-card-hover rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Zap className="w-3 h-3 text-muted" />
            <span className="text-xs text-muted">Débit ↑</span>
          </div>
          <span className="font-display font-bold text-sm text-foreground">{speedLabel(offer.uploadSpeed)}</span>
        </div>
      </div>

      {/* Services */}
      <div className="flex gap-2 flex-wrap">
        {offer.hasTV && (
          <span className="badge badge-success">
            <Tv className="w-3 h-3" />
            TV {offer.tvChannels && `• ${offer.tvChannels} chaînes`}
          </span>
        )}
        {offer.hasFixedPhone && (
          <span className="badge badge-muted">
            <Phone className="w-3 h-3" />
            Tél. fixe
          </span>
        )}
        {offer.hasMobilePhone && (
          <span className="badge badge-muted">
            <Smartphone className="w-3 h-3" />
            Mobile {offer.mobileData && `• ${offer.mobileData}`}
          </span>
        )}
        {offer.commitment === 0 ? (
          <span className="badge badge-success">Sans engagement</span>
        ) : (
          <span className="badge badge-muted">Engagement {offer.commitment} mois</span>
        )}
      </div>

      {/* Fees summary */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted">Installation</span>
          <span className={offer.installationFee === 0 ? 'text-success' : 'text-foreground'}>
            {offer.installationFee === 0 ? 'Offerte' : `${offer.installationFee}€`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Activation</span>
          <span className={offer.activationFee === 0 ? 'text-success' : 'text-foreground'}>
            {offer.activationFee === 0 ? 'Offerte' : `${offer.activationFee}€`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Location box</span>
          <span className={offer.modemRental === 0 ? 'text-success' : 'text-foreground'}>
            {offer.modemRental === 0 ? 'Incluse' : `+${offer.modemRental}€/mois`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Résiliation</span>
          <span className={offer.terminationFee === 0 ? 'text-success' : 'text-muted'}>
            {offer.terminationFee === 0 ? 'Gratuite' : `${offer.terminationFee}€`}
          </span>
        </div>
      </div>

      {/* SFR notice */}
      {isSFRGroup && (
        <div
          className="flex items-start gap-2 rounded-xl px-3 py-2 text-xs text-muted/70 leading-relaxed"
          style={{
            background: 'rgba(226,0,26,0.04)',
            border: '1px solid rgba(226,0,26,0.12)',
          }}
        >
          <Info className="w-3 h-3 text-primary/50 mt-0.5 shrink-0" />
          <span>{SFR_NOTICE}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-border/40">
        <div className="flex gap-2">
          <button
            onClick={() => !crossGroupBlocked && onToggleCompare(offer.id)}
            disabled={!canSelect && !crossGroupBlocked}
            title={
              crossGroupBlocked
                ? `Vous ne pouvez comparer que des offres du même groupe (${activeCategory === 'pure-player' ? 'Opérateurs historiques' : 'Marques low-cost'} sélectionné)`
                : undefined
            }
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selected
                ? 'bg-primary/20 text-primary border border-primary/40'
                : crossGroupBlocked
                ? 'border border-border/20 text-muted/30 cursor-not-allowed bg-card/30'
                : canSelect
                ? 'border border-border text-muted hover:border-primary/50 hover:text-primary'
                : 'border border-border/30 text-muted/40 cursor-not-allowed'
            }`}
          >
            {selected ? (
              <Check className="w-3.5 h-3.5" />
            ) : crossGroupBlocked ? (
              <Ban className="w-3.5 h-3.5" />
            ) : null}
            {selected ? 'Sélectionné' : crossGroupBlocked ? 'Groupe différent' : 'Comparer'}
          </button>
          <button
            onClick={() => onSimulate(offer)}
            className="flex-1 btn-primary text-xs py-2 justify-center"
          >
            Simuler le coût
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cross-group message */}
        {crossGroupBlocked && (
          <p className="text-xs text-muted/50 text-center leading-tight px-1">
            Sélection limitée aux{' '}
            <span className="text-muted/70">
              {activeCategory === 'pure-player' ? 'opérateurs historiques' : 'marques low-cost'}
            </span>{' '}
            déjà choisie(s).
          </p>
        )}
      </div>
    </motion.div>
  );
}
