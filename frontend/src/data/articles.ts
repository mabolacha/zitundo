export interface Article {
  id: string;
  slug: string;
  titre: string;
  metaDescription: string;
  datePublication: string;
  tempsLecture: number;
  categorie: 'comparatif' | 'guide' | 'actualite';
  imageAlt: string;
  chapeau: string;
  contenu: string;
}

export const articles: Article[] = [
  {
    id: '1',
    slug: 'meilleure-box-fibre-2026',
    titre: 'Quelle est la meilleure box fibre en 2026 ?',
    metaDescription:
      'Freebox Ultra, Bbox Ultym, Livebox Max... Comparatif des meilleures offres fibre du moment pour choisir la box adaptée à votre usage et votre budget.',
    datePublication: '2026-06-01',
    tempsLecture: 5,
    categorie: 'comparatif',
    imageAlt: 'Comparatif des meilleures box fibre 2026',
    chapeau:
      'Freebox Ultra, Bbox Ultym, Livebox Max... On compare les meilleures offres fibre du moment pour vous aider à choisir.',
    contenu: `<h2>Les critères pour choisir sa box fibre</h2>
<p>Pour choisir la meilleure box fibre en 2026, trois critères s'imposent : le débit réel, le prix sur la durée et les services inclus. Certaines offres affichent un tarif attractif les 12 premiers mois avant de doubler. D'autres intègrent Netflix, un décodeur TV ou le Wi-Fi&nbsp;7 — des éléments qui peuvent justifier un abonnement plus élevé si vous en avez l'usage.</p>

<h2>Notre sélection des meilleures box fibre</h2>
<p>La <strong>Freebox Ultra</strong> de Free s'impose comme le meilleur rapport qualité/prix : 8&nbsp;Gb/s de débit, Netflix et Disney+ inclus pour 49,99&nbsp;€/mois (puis 59,99&nbsp;€ après 12&nbsp;mois). La <strong>Bbox Ultym</strong> de Bouygues convainc les amateurs de TV avec son décodeur à intelligence artificielle et son Wi-Fi&nbsp;7 à 52,99&nbsp;€/mois. Côté budget, la <strong>RED Box Fibre</strong> reste la référence low-cost à 22,99&nbsp;€/mois sans engagement, avec 1&nbsp;Gb/s de débit.</p>

<h2>Notre verdict</h2>
<p>Il n'existe pas de meilleure box universelle — tout dépend de votre usage. Grand consommateur de streaming&nbsp;? Optez pour la Freebox Ultra. Vous cherchez la stabilité Wi-Fi dans un grand logement&nbsp;? La Bbox Ultym est faite pour vous. Budget serré&nbsp;? RED by SFR tient ses promesses. Utilisez notre simulateur pour calculer le coût réel sur 24&nbsp;mois et trouver l'offre adaptée à votre profil.</p>`,
  },
];
