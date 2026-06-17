import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import { articles } from '../data/articles';
import type { Article } from '../data/articles';

const BADGE: Record<Article['categorie'], string> = {
  comparatif: 'badge badge-primary',
  guide: 'badge badge-accent',
  actualite: 'badge badge-muted',
};

const LABEL: Record<Article['categorie'], string> = {
  comparatif: 'Comparatif',
  guide: 'Guide',
  actualite: 'Actualité',
};

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  const mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return `${day} ${mois[month - 1]} ${year}`;
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/blog" replace />;

  const similaires = articles
    .filter((a) => a.categorie === article.categorie && a.id !== article.id)
    .slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <PageSEO
        title={`${article.titre} | Zitundo`}
        description={article.metaDescription}
        path={`/blog/${article.slug}`}
      />

      {/* En-tête */}
      <div>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span className={BADGE[article.categorie]}>{LABEL[article.categorie]}</span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            {article.tempsLecture} min de lecture
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-dark leading-tight">
          {article.titre}
        </h1>
        <p className="text-sm text-muted mt-3">{formatDate(article.datePublication)}</p>
      </div>

      {/* Chapeau */}
      <p className="text-base text-foreground leading-relaxed border-l-4 border-accent pl-4 italic">
        {article.chapeau}
      </p>

      {/* Contenu */}
      <div
        className="
          [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-xl [&_h2]:text-primary-dark [&_h2]:mt-8 [&_h2]:mb-3
          [&_p]:text-foreground [&_p]:leading-relaxed [&_p]:mb-4
          [&_a]:text-primary [&_a]:hover:underline
          [&_strong]:font-semibold [&_strong]:text-foreground
        "
        dangerouslySetInnerHTML={{ __html: article.contenu }}
      />

      {/* CTA */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-bold text-primary-dark">Prêt à changer de box ?</p>
          <p className="text-sm text-muted mt-1">Comparez toutes les offres et simulez votre coût réel sur 24 mois.</p>
        </div>
        <Link to="/comparer" className="btn-accent whitespace-nowrap">
          Comparer maintenant <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Articles similaires */}
      {similaires.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display font-bold text-xl text-primary-dark">Articles similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similaires.map((a) => (
              <Link
                key={a.id}
                to={`/blog/${a.slug}`}
                className="glass-card p-5 flex flex-col gap-2 hover:border-primary/40 transition-colors"
              >
                <span className={BADGE[a.categorie]}>{LABEL[a.categorie]}</span>
                <p className="font-semibold text-primary-dark text-sm leading-snug">{a.titre}</p>
                <p className="text-xs text-muted">{formatDate(a.datePublication)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
