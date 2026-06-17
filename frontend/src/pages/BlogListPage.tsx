import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import { articles } from '../data/articles';
import type { Article } from '../data/articles';

type Filtre = 'all' | Article['categorie'];

const FILTRES: { value: Filtre; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'comparatif', label: 'Comparatifs' },
  { value: 'guide', label: 'Guides' },
  { value: 'actualite', label: 'Actualités' },
];

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

export default function BlogListPage() {
  const [filtre, setFiltre] = useState<Filtre>('all');

  const visibles = filtre === 'all'
    ? articles
    : articles.filter((a) => a.categorie === filtre);

  return (
    <div className="space-y-10">
      <PageSEO
        title="Blog Internet — Guides et Conseils | Zitundo"
        description="Guides pratiques, comparatifs et actualités pour choisir la meilleure offre internet en France."
        path="/blog"
      />

      <div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-dark">
          Blog — Guides et Conseils Internet
        </h1>
        <p className="text-muted mt-2">
          Comparatifs, guides pratiques et actualités pour bien choisir votre box internet.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {FILTRES.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltre(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150 ${
              filtre === f.value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-muted border-border hover:border-primary hover:text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grille */}
      {visibles.length === 0 ? (
        <p className="text-muted py-12 text-center">Aucun article dans cette catégorie pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibles.map((article) => (
            <article key={article.id} className="glass-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={BADGE[article.categorie]}>{LABEL[article.categorie]}</span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {article.tempsLecture} min de lecture
                </span>
              </div>

              <div className="space-y-2 flex-1">
                <h2 className="font-display font-bold text-lg text-primary-dark leading-snug">
                  {article.titre}
                </h2>
                <p className="text-sm text-muted leading-relaxed">{article.chapeau}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted">{formatDate(article.datePublication)}</span>
                <Link
                  to={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
                >
                  Lire l'article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
