import { ArrowLeftRight } from 'lucide-react';
import MigrationStepper from '../components/migration/MigrationStepper';
import PageSEO from '../components/PageSEO';

export default function MigrationPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageSEO
        title="Changer d'Opérateur Internet sans coupure | Zitundo"
        description="Changez de fournisseur internet en 4 étapes sans coupure de service. Récupérez votre RIO, souscrivez au nouveau FAI et gérez la transition sereinement."
        path="/migration"
      />
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ArrowLeftRight className="w-6 h-6 text-primary" />
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            Changer d'<span className="text-gradient">Opérateur</span> Internet
          </h1>
        </div>
        <p className="text-muted">
          Suivez les étapes pour changer d'opérateur sans erreur. Récupérez votre RIO, gérez la résiliation et le retour matériel.
        </p>
      </div>
      <MigrationStepper />
    </div>
  );
}
