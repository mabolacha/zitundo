import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, BarChart3, Clock, Star, CheckCircle } from 'lucide-react';
import PageSEO from '../components/PageSEO';

const STATS = [
  { icon: Shield, label: '100% Gratuit', sub: 'Aucune commission cachée', color: 'text-primary' },
  { icon: BarChart3, label: '19 offres', sub: 'Comparées en 2 minutes', color: 'text-primary' },
  { icon: Zap, label: 'Temps réel', sub: 'Prix mis à jour quotidiennement', color: 'text-success' },
  { icon: Clock, label: '< 2 minutes', sub: 'Pour trouver votre offre idéale', color: 'text-warning' },
];

const FEATURES = [
  {
    title: 'Comparateur intelligent',
    desc: 'Filtrez par technologie, prix, débit, opérateur et services inclus. Comparez jusqu\'à 4 offres côte à côte.',
    icon: BarChart3,
    href: '/comparer',
    cta: 'Comparer maintenant',
  },
  {
    title: 'Simulateur de coût réel',
    desc: 'Calculez le coût réel sur 24 mois en incluant frais d\'installation, activation et location de box.',
    icon: Zap,
    href: '/simulateur',
    cta: 'Simuler le coût réel',
  },
  {
    title: 'Changer d\'Opérateur',
    desc: 'Checklist interactive : RIO, résiliation, retour matériel. Générez votre lettre de résiliation en un clic.',
    icon: CheckCircle,
    href: '/migration',
    cta: 'Changer d\'opérateur',
  },
  {
    title: 'Test d\'éligibilité',
    desc: 'Vérifiez quelles technologies (Fibre, ADSL) et quels opérateurs sont disponibles à votre adresse.',
    icon: Shield,
    href: '/eligibilite',
    cta: 'Tester mon adresse',
  },
];

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    text: 'J\'ai économisé 18€/mois grâce au simulateur de coût réel. Je ne savais pas que la promo masquait autant de frais !',
    rating: 5,
  },
  {
    name: 'Thomas B.',
    text: 'La checklist pour changer d\'opérateur est parfaite. J\'ai récupéré mon RIO en 2 minutes et la lettre de résiliation était prête.',
    rating: 5,
  },
  {
    name: 'Sophie M.',
    text: 'Enfin un comparateur qui montre le vrai coût et pas juste le prix promo affiché partout.',
    rating: 5,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-24">
      <PageSEO
        title="Comparez les offres Internet en France | Zitundo"
        description="Comparez gratuitement les offres internet fibre et ADSL d'Orange, Free, SFR, Bouygues, Sosh, RED et B&You. Simulez le coût réel sur 24 mois."
        path="/"
        imageAlt="Zitundo, comparateur d'offres internet en France"
      />
      {/* Hero */}
      <section className="relative pt-8 pb-16 text-center overflow-hidden bg-primary-light border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Subtle background tint */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none bg-primary/10"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="badge badge-primary text-sm px-4 py-2 mb-6 inline-flex">
            <Zap className="w-3.5 h-3.5" />
            Comparaison 100% indépendante
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-7xl leading-tight mb-6 text-primary-dark">
            Trouvez la{' '}
            <span className="text-primary">meilleure offre internet</span>
            <br />
            en France
          </h1>

          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Comparez Orange, Free, SFR, Bouygues et toutes les marques low-cost.
            Simulez le vrai coût sur 24 mois. Migrez en toute sérénité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/comparer')}
              className="btn-primary text-base px-8 py-4"
            >
              Comparer les offres
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/eligibilite')}
              className="btn-secondary text-base px-8 py-4"
            >
              Tester mon éligibilité
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={item} className="stat-card group">
              <s.icon className={`w-8 h-8 ${s.color} mx-auto mb-3 transition-transform duration-300 group-hover:scale-110`} />
              <div className="font-display font-bold text-2xl text-foreground mb-1">{s.label}</div>
              <div className="text-xs text-muted">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-3">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-muted text-lg">
            Des outils conçus pour vous aider à choisir en toute transparence.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass-card p-6 group cursor-pointer"
              onClick={() => navigate(f.href)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">{f.desc}</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {f.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-foreground mb-3">
            Ce qu'en disent les utilisateurs
          </h2>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={item} className="glass-card p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-muted text-sm leading-relaxed mb-4">"{t.text}"</p>
              <p className="text-foreground font-semibold text-sm">{t.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-10 text-center relative overflow-hidden border border-border bg-primary-light"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(26, 58, 92, 0.08), transparent 60%)' }}
          />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Prêt à trouver votre offre idéale ?
            </h2>
            <p className="text-muted text-lg mb-8">
              Gratuit, sans inscription, résultat en moins de 2 minutes.
            </p>
            <button
              onClick={() => navigate('/comparer')}
              className="btn-primary text-base px-10 py-4"
            >
              Démarrer la comparaison
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
