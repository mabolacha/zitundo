import { ArrowLeftRight } from 'lucide-react';
import MigrationStepper from '../components/migration/MigrationStepper';
import PageSEO from '../components/PageSEO';

export default function MigrationPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageSEO
        title="Guide de migration opérateur internet — Changer de FAI sans coupure"
        description="Suivez notre guide étape par étape pour changer d'opérateur internet sans stress : récupérer votre RIO, souscrire chez le nouveau FAI, restituer le matériel et obtenir le remboursement des frais de résiliation."
        path="/migration"
      />
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ArrowLeftRight className="w-6 h-6 text-primary" />
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            Guide de <span className="text-gradient">Migration</span>
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
