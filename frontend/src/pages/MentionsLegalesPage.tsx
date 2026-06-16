import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageSEO from '../components/PageSEO';

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <PageSEO
        title="Mentions Légales & Politique de Confidentialité | Zitundo"
        description="Mentions légales, politique de confidentialité et gestion des cookies du comparateur d'offres internet Zitundo."
        path="/mentions-legales"
      />

      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-dark">
          Mentions Légales & Confidentialité
        </h1>
        <p className="text-muted mt-2">Dernière mise à jour : juin 2026</p>
      </div>

      {/* Éditeur */}
      <section className="glass-card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-primary-dark">1. Éditeur du site</h2>
        <div className="text-sm text-muted space-y-1 leading-relaxed">
          <p><span className="font-medium text-foreground">Nom :</span> [NOM / RAISON SOCIALE]</p>
          <p><span className="font-medium text-foreground">Adresse :</span> [ADRESSE COMPLÈTE]</p>
          <p><span className="font-medium text-foreground">Email :</span> [EMAIL DE CONTACT]</p>
          <p><span className="font-medium text-foreground">Site web :</span> https://zitundo.com</p>
          <p className="pt-2 text-xs text-muted/70 italic">
            En tant que site d'information et de comparaison non soumis à immatriculation commerciale obligatoire, les informations ci-dessus seront complétées lors de la mise en production.
          </p>
        </div>
      </section>

      {/* Hébergeur */}
      <section className="glass-card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-primary-dark">2. Hébergeur</h2>
        <div className="text-sm text-muted space-y-1 leading-relaxed">
          <p><span className="font-medium text-foreground">Société :</span> Hostinger International Ltd</p>
          <p><span className="font-medium text-foreground">Adresse :</span> 61 Lordou Vironos, 6023 Larnaca, Chypre</p>
          <p><span className="font-medium text-foreground">Site :</span> www.hostinger.fr</p>
        </div>
      </section>

      {/* Données collectées */}
      <section className="glass-card p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-primary-dark">3. Données collectées</h2>
        <p className="text-sm text-muted leading-relaxed">
          Zitundo est un comparateur d'offres internet <strong className="text-foreground">100% gratuit et indépendant</strong>.
          Nous ne vendons pas vos données personnelles et ne collectons aucune information vous identifiant directement sans votre consentement.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Les données suivantes peuvent être traitées selon vos choix de consentement :
        </p>
        <ul className="text-sm text-muted space-y-2 list-disc list-inside leading-relaxed">
          <li><strong className="text-foreground">Données de navigation :</strong> pages visitées, durée de visite (si cookies analytiques acceptés).</li>
          <li><strong className="text-foreground">Données d'affiliation :</strong> clic sur un lien partenaire (si cookies d'affiliation acceptés). Ces données permettent à Zitundo d'être rémunéré lors d'une souscription via le site.</li>
          <li><strong className="text-foreground">Préférences de consentement :</strong> stockées en localStorage sur votre appareil (pas envoyées à nos serveurs).</li>
        </ul>
      </section>

      {/* Durée de conservation */}
      <section className="glass-card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-primary-dark">4. Durée de conservation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-semibold text-foreground">Cookie / donnée</th>
                <th className="py-2 pr-4 font-semibold text-foreground">Finalité</th>
                <th className="py-2 font-semibold text-foreground">Durée</th>
              </tr>
            </thead>
            <tbody className="text-muted divide-y divide-border/50">
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">zitundo_cookie_consent</td>
                <td className="py-2.5 pr-4">Mémorisation de vos choix de consentement</td>
                <td className="py-2.5">13 mois</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Cookies analytiques</td>
                <td className="py-2.5 pr-4">Audience, comportement de navigation (Google Analytics ou équivalent)</td>
                <td className="py-2.5">13 mois</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Cookies d'affiliation</td>
                <td className="py-2.5 pr-4">Suivi des souscriptions via liens partenaires</td>
                <td className="py-2.5">30 jours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Droits RGPD */}
      <section className="glass-card p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-primary-dark">5. Vos droits (RGPD)</h2>
        <p className="text-sm text-muted leading-relaxed">
          Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :
        </p>
        <ul className="text-sm text-muted space-y-2 list-disc list-inside leading-relaxed">
          <li><strong className="text-foreground">Droit d'accès :</strong> obtenir une copie des données vous concernant.</li>
          <li><strong className="text-foreground">Droit de rectification :</strong> corriger des données inexactes.</li>
          <li><strong className="text-foreground">Droit à l'effacement :</strong> demander la suppression de vos données.</li>
          <li><strong className="text-foreground">Droit à la limitation :</strong> restreindre le traitement de vos données.</li>
          <li><strong className="text-foreground">Droit d'opposition :</strong> vous opposer à un traitement basé sur notre intérêt légitime.</li>
          <li><strong className="text-foreground">Droit à la portabilité :</strong> recevoir vos données dans un format structuré.</li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          Pour exercer ces droits, contactez notre délégué à la protection des données (DPO) à :{' '}
          <a href="mailto:[EMAIL DPO]" className="text-primary hover:underline">[EMAIL DPO]</a>.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Vous pouvez également introduire une réclamation auprès de la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNIL</a>.
        </p>
      </section>

      {/* Gestion cookies */}
      <section className="glass-card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-primary-dark">6. Gestion des cookies</h2>
        <p className="text-sm text-muted leading-relaxed">
          Vous pouvez modifier vos préférences de cookies à tout moment.
          Votre consentement est conservé 13 mois, conformément aux recommandations de la CNIL.
        </p>
        <button
          onClick={() => window.dispatchEvent(new Event('zitundo:open-cookie-manager'))}
          className="btn-secondary text-sm py-2 px-5"
        >
          Gérer mes cookies
        </button>
      </section>

      {/* Contact */}
      <section className="glass-card p-6 space-y-3">
        <h2 className="font-display font-bold text-xl text-primary-dark">7. Contact</h2>
        <p className="text-sm text-muted leading-relaxed">
          Pour toute question relative à ce site ou à vos données personnelles :{' '}
          <a href="mailto:[EMAIL DE CONTACT]" className="text-primary hover:underline">[EMAIL DE CONTACT]</a>
        </p>
      </section>
    </div>
  );
}
