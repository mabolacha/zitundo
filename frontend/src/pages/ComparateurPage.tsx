import { BarChart3 } from 'lucide-react';
import Comparateur from '../components/comparateur/Comparateur';
import PageSEO from '../components/PageSEO';

const ENGAGEMENT_POINTS = [
  "Zitundo est un service 100% indépendant. Les offres référencées sont sélectionnées selon des critères objectifs, sans favoritisme.",
  "Nous ne transmettons aucune donnée personnelle de nos visiteurs aux opérateurs.",
  "Zitundo est financé par des commissions d'affiliation versées lors de souscriptions via nos liens — ce financement ne biaise pas le classement des offres.",
  "Toutes les offres sont présentées avec la même équité, quelle que soit la commission associée.",
];

const OFFRES_POINTS = [
  "Notre comparateur couvre les principaux fournisseurs d'accès à Internet du marché français : Orange, Free, SFR, Bouygues, Sosh, RED by SFR et B&You.",
  "Les tarifs et caractéristiques sont vérifiés chaque mois à partir des données collectées par UFC-Que Choisir sur les sites des opérateurs.",
  "La sélection est représentative du marché, sans prétendre à l'exhaustivité.",
];

function MethodeSection({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-primary font-semibold text-[0.9rem] uppercase tracking-wide">{title}</p>
      <ul className="space-y-2.5">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="text-primary font-bold mt-0.5 shrink-0">✓</span>
            <span className="text-muted text-[0.9rem] leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ComparateurPage() {
  return (
    <div className="space-y-6">
      <PageSEO
        title="Comparateur Offres Internet Fibre & ADSL | Zitundo"
        description="Filtrez et comparez 11 offres internet des principaux opérateurs français. Fibre ou ADSL, avec ou sans TV, avec ou sans engagement."
        path="/comparer"
      />
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            <span className="text-gradient">Comparateur</span> d'offres Internet
          </h1>
        </div>
        <p className="text-muted">
          Filtrez parmi 11 offres des principaux opérateurs français. Sélectionnez jusqu'à 4 offres pour un tableau comparatif détaillé.
        </p>
      </div>
      <Comparateur />
      <div className="bg-card border border-border rounded-[14px] p-6 space-y-6">
        <h2 className="font-display font-bold text-xl text-primary-dark">
          Comment fonctionne Zitundo ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MethodeSection title="Notre engagement" points={ENGAGEMENT_POINTS} />
          <MethodeSection title="Les offres présentées" points={OFFRES_POINTS} />
        </div>
      </div>
    </div>
  );
}
