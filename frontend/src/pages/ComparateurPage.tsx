import { BarChart3 } from 'lucide-react';
import Comparateur from '../components/comparateur/Comparateur';
import PageSEO from '../components/PageSEO';

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
    </div>
  );
}
