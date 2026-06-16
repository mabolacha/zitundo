import { MapPin } from 'lucide-react';
import EligibiliteChecker from '../components/eligibilite/EligibiliteChecker';
import PageSEO from '../components/PageSEO';

export default function EligibilitePage() {
  return (
    <div className="space-y-6">
      <PageSEO
        title="Tester mon Éligibilité Fibre & ADSL | Zitundo"
        description="Vérifiez si la fibre optique est disponible à votre adresse en France. Résultats basés sur les données des opérateurs."
        path="/eligibilite"
      />
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            Test d'<span className="text-gradient">Éligibilité</span>
          </h1>
        </div>
        <p className="text-muted max-w-xl mx-auto">
          Découvrez quelles technologies internet (Fibre FTTH, ADSL) et quels opérateurs sont disponibles à votre adresse.
        </p>
      </div>
      <EligibiliteChecker />
    </div>
  );
}
