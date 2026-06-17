import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Phone, Wifi, Package, RotateCcw, FileText, AlertTriangle, Lightbulb, X, Copy, Download } from 'lucide-react';

type Step = {
  id: number;
  title: string;
  description: string;
  warning?: string;
  bullets?: string[];
  tip?: string;
  done: boolean;
};

const STEP_ICONS = [Phone, Wifi, Package, RotateCcw];

const INITIAL_STEPS: Omit<Step, 'done'>[] = [
  {
    id: 1,
    title: 'Récupérer votre RIO (Relevé d\'Identité Opérateur)',
    description: 'Le RIO est un code unique à 12 caractères qui identifie votre ligne — c\'est la clé de toute l\'opération.',
    bullets: [
      'Appelez le 3179 (appel gratuit) depuis votre ligne fixe actuelle.',
      'Un serveur vocal vous dictera le code, généralement confirmé par SMS ou email.',
    ],
  },
  {
    id: 2,
    title: 'Souscrire chez le nouveau fournisseur (et uniquement cela)',
    description: 'Rendez-vous sur le site du nouveau FAI ou en boutique pour souscrire une offre.',
    warning: 'Ne résiliez surtout pas votre abonnement actuel vous-même : votre ligne serait coupée et vous perdriez votre numéro de téléphone.',
    bullets: [
      'Rendez-vous sur le site du nouveau FAI ou en boutique.',
      'Cochez « Conserver mon numéro de fixe actuel » et renseignez le RIO de l\'étape 1.',
      'En lui fournissant le RIO, vous mandatez le nouveau FAI pour résilier votre ancien contrat à votre place. La résiliation ne se déclenche qu\'une fois la nouvelle ligne active, ce qui évite toute coupure.',
    ],
  },
  {
    id: 3,
    title: 'Réception et installation du nouveau matériel',
    description: 'Référez-vous aux instructions de votre nouveau FAI pour la réception et l\'installation de votre nouvelle box (et décodeur TV si applicable).',
  },
  {
    id: 4,
    title: 'Restitution de l\'ancien matériel et frais',
    description: 'Référez-vous aux instructions de votre ancien FAI pour la restitution de votre matériel (box, câbles, décodeur).',
    bullets: [
      'Frais de résiliation : environ 50€, facturés par presque tous les opérateurs (montant à confirmer auprès de votre ancien FAI).',
    ],
    tip: 'Demandez le remboursement de ces frais au nouveau FAI — la plupart proposent des offres de bienvenue.',
  },
];

const EMAIL_TEMPLATE = `À : service client [Nouveau FAI]
Objet : Demande de remboursement des frais de résiliation – Offre de bienvenue

Madame, Monsieur,

Client(e) récemment souscrit(e) à votre offre [Nom de l'offre], je souhaite bénéficier du remboursement des frais de résiliation facturés par mon ancien opérateur, comme prévu dans votre offre de bienvenue.

Ces frais s'élèvent à [montant] €, tels que mentionnés sur ma facture de clôture de [Ancien FAI].

Vous trouverez ci-joint la facture de clôture de mon ancien opérateur justifiant ces frais.

Dans l'attente de votre retour, je vous adresse mes cordiales salutations.

[Votre Prénom et Nom]
[Votre numéro de contrat / identifiant client]
[Votre numéro de téléphone]`;

export default function MigrationStepper() {
  const [steps, setSteps] = useState<Step[]>(
    INITIAL_STEPS.map((s) => ({ ...s, done: false }))
  );
  const [expanded, setExpanded] = useState<number | null>(1);
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const doneCount = steps.filter((s) => s.done).length;
  const progress = (doneCount / steps.length) * 100;

  const toggleDone = (id: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
    if (id < steps.length) setExpanded(id + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([EMAIL_TEMPLATE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-remboursement-frais-resiliation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-foreground text-lg">Votre progression</h2>
          <span className="badge badge-primary">
            {doneCount}/{steps.length} étapes
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-2.5 rounded-full bg-primary"
          />
        </div>
        <p className="text-xs text-muted mt-2">
          {doneCount === steps.length
            ? '🎉 Changement d\'opérateur terminé ! Félicitations.'
            : `${steps.length - doneCount} étape${steps.length - doneCount > 1 ? 's' : ''} restante${steps.length - doneCount > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = STEP_ICONS[idx];
          const isExpanded = expanded === step.id;

          return (
            <motion.div
              key={step.id}
              layout
              className={`glass-card overflow-hidden transition-all duration-200 ${step.done ? 'opacity-70' : ''}`}
            >
              <button
                className="w-full flex items-center gap-4 p-4 text-left"
                onClick={() => setExpanded(isExpanded ? null : step.id)}
              >
                {/* Step indicator */}
                <div
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.done ? 'bg-success/20 text-success' : 'border-2 border-primary/35 text-muted'
                  }`}
                >
                  {step.done ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold text-primary">{step.id}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted shrink-0" />
                    <span className={`font-semibold text-sm ${step.done ? 'line-through text-muted' : 'text-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                  {!isExpanded && (
                    <p className="text-xs text-muted mt-0.5 truncate">{step.description}</p>
                  )}
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-sm text-muted">{step.description}</p>

                      {/* Warning block */}
                      {step.warning && (
                        <div
                          className="flex items-start gap-2.5 rounded-xl p-3 bg-warning/10 border border-warning/30"
                        >
                          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          <p className="text-xs text-foreground/80 leading-relaxed">{step.warning}</p>
                        </div>
                      )}

                      {/* Bullet points */}
                      {step.bullets && step.bullets.length > 0 && (
                        <ul
                          className="rounded-xl p-3 space-y-2 bg-card-hover border border-border"
                        >
                          {step.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                              <span className="text-primary mt-0.5 shrink-0">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* RIO portability warning — step 1 only */}
                      {step.id === 1 && (
                        <div className="rounded-[10px] p-4 bg-warning/10 border border-warning space-y-2.5">
                          <p className="text-sm font-semibold text-foreground flex items-start gap-1.5">
                            <span className="shrink-0">⚠️</span>
                            Dans quels cas la portabilité est-elle impossible ?
                          </p>
                          <p className="text-sm text-foreground">
                            Votre demande de portabilité peut être refusée dans 3 cas :
                          </p>
                          <ul className="space-y-1.5">
                            {[
                              'Votre RIO fait déjà l\'objet d\'une demande de portabilité en cours.',
                              'Votre numéro est inactif ou résilié depuis plus de 40 jours.',
                              'Vous déménagez dans une autre zone de numérotation élémentaire (ex : un numéro en 01 ne peut pas devenir un 04). Il existe 414 zones en France.',
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                <span className="shrink-0 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-muted italic leading-relaxed">
                            Exception : les numéros non géographiques en 09 (numéro de votre box) restent portables partout en France.
                          </p>
                        </div>
                      )}

                      {/* Tip block */}
                      {step.tip && (
                        <div
                          className="flex items-start gap-2.5 rounded-xl p-3 bg-primary/5 border border-primary/20"
                        >
                          <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-xs text-muted leading-relaxed">
                            <span className="text-primary font-medium">Astuce : </span>
                            {step.tip}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleDone(step.id); }}
                          className={step.done ? 'btn-secondary text-sm py-2' : 'btn-primary text-sm py-2'}
                        >
                          {step.done ? (
                            <><X className="w-3.5 h-3.5" />Marquer comme à faire</>
                          ) : (
                            <><Check className="w-3.5 h-3.5" />Marquer comme fait</>
                          )}
                        </button>

                        {step.id === 4 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowEmail(true); }}
                            className="btn-secondary text-sm py-2"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Générer un email de demande de remboursement
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Email modal */}
      <AnimatePresence>
        {showEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => setShowEmail(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-lg p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Email de demande de remboursement
                </h3>
                <button
                  onClick={() => setShowEmail(false)}
                  aria-label="Fermer"
                  className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-card transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted mb-3 leading-relaxed">
                Envoyez cet email au service client de votre <span className="text-foreground">nouveau FAI</span>, en joignant votre facture de clôture de l'ancien opérateur comme justificatif.
              </p>

              <div
                className="rounded-xl p-5 font-mono text-xs text-muted whitespace-pre-wrap leading-relaxed bg-card-hover border border-border"
              >
                {EMAIL_TEMPLATE}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCopy}
                  className="btn-secondary text-sm py-2 flex-1 justify-center"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-success" />Copié !</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" />Copier le texte</>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="btn-primary text-sm py-2 flex-1 justify-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </button>
              </div>

              <p className="text-xs text-muted/60 mt-2 text-center">
                Remplacez les champs entre crochets avant envoi.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
