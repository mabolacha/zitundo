import { useSearchParams } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import SimulateurTCO from '../components/simulateur/SimulateurTCO';
import PageSEO from '../components/PageSEO';

export default function SimulateurPage() {
  const [params] = useSearchParams();
  const offerId = params.get('offer');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageSEO
        title="Simulateur de coût réel Internet sur 24 mois — Comparateur Internet France"
        description="Calculez le vrai coût de votre abonnement internet sur 24 mois : prix promo, frais d'installation, activation et location de box. Simulez n'importe quelle offre en quelques secondes."
        path="/simulateur"
      />
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-primary" />
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            Simulateur de <span className="text-gradient">coût réel</span>
          </h1>
        </div>
        <p className="text-muted">
          Calculez le coût réel sur 24 mois pour n'importe quelle offre, en incluant tous les frais annexes.
        </p>
      </div>
      <SimulateurTCO preselectedId={offerId} />
    </div>
  );
}
