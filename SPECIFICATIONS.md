# Zitundo — Dossier de spécifications

**Comparateur d'offres internet en France** — comparaison indépendante, simulation de coût réel, guide de changement d'opérateur et test d'éligibilité.

| | |
|---|---|
| **Nom commercial** | Zitundo |
| **Domaine** | zitundo.com |
| **Hébergement** | Hostinger |
| **Statut** | MVP fonctionnel — thème clair "charte Zitundo" appliqué, backend connecté |
| **Dernière mise à jour** | 2026-06-16 |

---

## 1. Présentation générale

Zitundo est un comparateur indépendant d'offres internet (fibre, ADSL) pour le marché français. L'objectif est d'aider l'utilisateur à :

1. **Comparer** les offres des opérateurs historiques (Orange, Free, SFR, Bouygues) et des marques low-cost (Sosh, RED by SFR, B&You) selon des critères objectifs (prix, débit, services).
2. **Simuler le coût réel** d'un abonnement sur 24 mois, en intégrant les frais souvent dissimulés derrière un prix promo (installation, activation, location de box, résiliation).
3. **Changer d'opérateur sans coupure** grâce à un guide étape par étape (récupération du RIO, souscription, restitution du matériel).
4. **Vérifier son éligibilité** à la fibre/ADSL à une adresse donnée.

Le site se positionne comme 100% gratuit et indépendant (pas de commission cachée affichée).

---

## 2. Architecture technique

### 2.1 Stack

| Couche | Technologies |
|---|---|
| Frontend | React 18 + TypeScript, Vite, React Router v6, Tailwind CSS v3, Framer Motion, Axios, react-helmet-async |
| Backend | Express 4 + TypeScript, ts-node/nodemon en dev |
| Données | Fichier JSON statique (`offres.json`), lu à la volée — pas de base de données branchée actuellement |
| Polices | Space Grotesk (titres / `font-display`), DM Sans (texte / `font-sans`), chargées via Google Fonts dans `index.html` |

### 2.2 Structure des dossiers

```
comparateur-internet-france/
├── backend/
│   ├── src/
│   │   ├── data/offres.json        # Source de vérité des 11 offres
│   │   ├── routes/offres.ts        # GET /api/offres
│   │   └── server.ts               # App Express, mount des routes
│   ├── .env                        # PORT=5001 (non versionné)
│   └── nodemon.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── comparateur/        # Filters, OfferCard, CompareTable, Comparateur
│   │   │   ├── simulateur/         # SimulateurTCO
│   │   │   ├── migration/          # MigrationStepper
│   │   │   ├── eligibilite/        # EligibiliteChecker
│   │   │   ├── Navbar.tsx
│   │   │   └── PageSEO.tsx         # Wrapper react-helmet-async (title/description/OG)
│   │   ├── pages/                  # HomePage, ComparateurPage, SimulateurPage, MigrationPage, EligibilitePage
│   │   ├── data/offers.ts          # Ancien mock local (encore utilisé par SimulateurTCO)
│   │   ├── types/index.ts          # Offer, Filters, TCOResult, EligibilityResult, MigrationStep
│   │   └── styles/index.css        # Design system Tailwind (@layer components)
│   ├── public/
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── og-image.png
│   ├── tailwind.config.js
│   └── vite.config.ts              # Proxy /api → http://localhost:5001
└── package.json                    # Scripts racine (concurrently dev:backend + dev:frontend)
```

### 2.3 Environnements & ports

| Service | Port dev | Commande |
|---|---|---|
| Frontend (Vite) | 3000 | `npm run dev:frontend` |
| Backend (Express) | 5001 (`.env` → `PORT`) | `npm run dev:backend` |
| Les deux ensemble | — | `npm run dev` (racine, via `concurrently`) |

Le proxy Vite redirige toute requête `/api/*` vers `http://localhost:5001`, donc aucune configuration CORS supplémentaire n'est nécessaire en développement (`cors()` est tout de même activé côté Express).

### 2.4 Dépendances backend scaffoldées mais non utilisées

Le `package.json` backend liste `pg`, `sequelize`, `redis`, `jsonwebtoken`, `bcryptjs`, `helmet`, `compression`, `express-rate-limit`, `winston`, `morgan` — **aucune n'est actuellement importée dans le code**. Le serveur réel (`server.ts`) ne fait que : `cors`, `express.json`, une route `/health` et le routeur `/api/offres`. Ces dépendances correspondent à une architecture prévue (auth, base de données, logs, rate-limiting) pour une phase ultérieure, pas à l'état actuel.

---

## 3. Pages & fonctionnalités

### 3.1 Accueil (`/`)

- Hero avec titre "Trouvez la **meilleure offre internet** en France", badge "Comparaison 100% indépendante", CTA primaire → `/comparer`, CTA secondaire → `/eligibilite`.
- Bande de 4 statistiques (100% gratuit, 11 offres, temps réel, < 2 minutes).
- 4 cartes fonctionnalités (Comparateur, Simulateur, Changer d'Opérateur, Éligibilité), cliquables, redirigent vers la page correspondante.
- 3 témoignages utilisateurs (contenu statique, pas de CMS).
- Bandeau CTA de fin de page.

### 3.2 Comparateur (`/comparer`)

- **Filtres** (`Filters.tsx`) : technologie (Fibre/ADSL/Toutes), prix max (slider 15–100€), débit minimum (boutons 0/100/500/1000/5000 Mbps), opérateur (select), services inclus (TV, téléphonie).
- **Liste des offres** (`OfferCard.tsx`), répartie en deux sections :
  - *Opérateurs historiques* (`categorie: 'pure-player'`) : Orange, Free, SFR, Bouygues.
  - *Marques low-cost* (`categorie: 'low-cost'`) : Sosh, RED by SFR, B&You.
- Chaque carte affiche : marque/logo, technologie, prix promo + prix régulier post-promo, débits montant/descendant, services (TV, téléphonie fixe/mobile), frais (installation, activation, location box, résiliation), engagement.
- **Sélection multi-offres** : jusqu'à 4 offres comparables simultanément, **limitées à une seule catégorie à la fois** (on ne peut pas comparer un opérateur historique avec un low-cost dans le même tableau).
- **Mode comparaison** (`CompareTable.tsx`) : tableau côte-à-côte de tous les critères pour les offres sélectionnées.
- Bouton "Simuler le coût" sur chaque carte → redirige vers `/simulateur?offer={id}`.
- **Chargement des données** : `axios.get('/api/offres')` au montage, avec état de chargement (skeleton grid à 6 cartes `animate-pulse`) et état d'erreur (message + bouton "Réessayer").
- Avertissement contextuel sur les offres SFR (rachat prévu 2027, sous réserve de validation réglementaire).

### 3.3 Simulateur de coût réel (`/simulateur`)

- Sélection d'une offre (pré-remplie via `?offer=id` si on arrive depuis le comparateur).
- Option "Inclure les frais de résiliation actuels".
- **Formule de calcul (sur 24 mois)** :
  ```
  Coût total = (prix promo × mois_promo)
             + (prix régulier × mois_restants)
             + frais d'installation
             + frais d'activation
             + (location box × 24)
             + frais de résiliation (optionnel)
  ```
- Affichage : coût total sur 24 mois, coût mensuel lissé, détail ligne par ligne avec barres de progression proportionnelles, explication "Pourquoi 24 mois ?" en accordéon.
- ⚠️ Utilise encore `frontend/src/data/offers.ts` (mock local), **pas** l'API backend — seul le `Comparateur` a été migré vers `/api/offres`.

### 3.4 Changer d'Opérateur (`/migration`)

> Anciennement nommée "Migration" — texte affiché renommé, route et noms de fichiers/composants (`MigrationPage.tsx`, `MigrationStepper.tsx`) conservés pour stabilité SEO et code.

- Checklist interactive en 4 étapes : récupération du RIO (3179), souscription chez le nouveau FAI (mandat de résiliation via RIO), réception/installation du nouveau matériel, restitution de l'ancien matériel.
- Barre de progression globale, étapes dépliables, avertissement sur le risque de coupure si résiliation manuelle.
- Génération d'un **email de demande de remboursement des frais de résiliation** (modal avec template pré-rempli, copie ou téléchargement `.txt`).

### 3.5 Éligibilité (`/eligibilite`)

- Formulaire d'adresse avec validation basique (longueur, présence d'un numéro, ≥ 3 mots).
- **Simulation déterministe côté client** (`simulateEligibility`) basée sur un hash de l'adresse — **pas d'appel à une API officielle (ARCEP, opérateurs)** : résultat illustratif, pas réel.
- Résultat : disponibilité fibre/ADSL, NRO le plus proche (liste statique de 12 NRO fictifs), débit max estimé, opérateurs disponibles, CTA vers le comparateur.

---

## 4. Modèle de données

### 4.1 `Offer` (backend `offres.json` ↔ frontend `types/index.ts`)

```ts
interface Offer {
  id: string;
  categorie: 'pure-player' | 'low-cost';
  operator: string;          // Orange, Free, SFR, Bouygues
  brand: string;             // Orange, Sosh, Free, RED by SFR, SFR, B&You, Bouygues Telecom
  name: string;
  promoPrice: number;        // €/mois pendant la promo
  regularPrice: number;      // €/mois après la promo (= promoPrice si prix fixe)
  promoDuration: number;     // mois (0 = prix fixe, pas de promo)
  technology: 'Fibre' | 'ADSL' | 'VDSL' | '4G Box' | '5G Box';
  downloadSpeed: number;     // Mbps
  uploadSpeed: number;       // Mbps
  installationFee: number;
  activationFee: number;
  modemRental: number;       // €/mois
  terminationFee: number;
  hasTV: boolean;
  tvChannels?: number;
  hasFixedPhone: boolean;
  hasMobilePhone: boolean;
  mobileData?: string;
  commitment: number;        // mois (0 = sans engagement)
  highlight?: string;        // ex: "Meilleur débit", "Sans engagement"
  color: string;             // couleur de marque (hex), affichage badge
  logo: string;               // emoji
}
```

### 4.2 Jeu de données actuel (11 offres, données juin 2026)

| Brand | Offre | Prix promo | Prix régulier | Engagement | Catégorie |
|---|---|---|---|---|---|
| Orange | Livebox Up Fibre | 39,99€ | 51,99€ | 12 mois | pure-player |
| Orange | Livebox 5 Fibre | 29,99€ | 44,99€ | 12 mois | pure-player |
| Free | Freebox Ultra | 49,99€ | — (fixe) | sans engagement | pure-player |
| Free | Freebox Pop | 29,99€ | 39,99€ | sans engagement | pure-player |
| SFR | SFR Fibre Power | 36,99€ | — (fixe) | 12 mois | pure-player |
| Bouygues Telecom | Bbox Fit Fibre | 28,99€ | 35,99€ | 12 mois | pure-player |
| SFR | SFR Box 7 ADSL | 18,99€ | 28,99€ | 12 mois | pure-player |
| Sosh | Série Spéciale Sosh Fibre | 24,99€ | — (fixe) | sans engagement | low-cost |
| RED by SFR | RED Box 8 Fibre | 23,99€ | — (fixe) | sans engagement | low-cost |
| B&You | B&You Box ADSL | 12,99€ | 22,99€ | sans engagement | low-cost |
| B&You | B&YOU Pure Fibre | 24,99€ | — (fixe) | sans engagement | low-cost |

### 4.3 Autres types

- `Filters` : `technology`, `maxPrice`, `minDownload`, `operator`, `hasTV`, `hasPhone`.
- `TCOResult` : sortie du calcul de coût réel (détail des postes + total + mensuel lissé).
- `EligibilityResult` : `address`, `hasFiber`, `hasADSL`, `nro`, `maxSpeed`, `availableOperators`.
- `MigrationStep` : structure d'une étape de la checklist changement d'opérateur.

---

## 5. API backend

| Méthode | Route | Description | Réponse |
|---|---|---|---|
| GET | `/health` | Healthcheck | `{ status: 'OK', message: 'Backend is running!' }` |
| GET | `/api/offres` | Liste des 11 offres | `Offer[]` (lu depuis `offres.json` à chaque requête via `fs.readFileSync`) |

Le fichier JSON est relu à chaque appel (pas de cache en mémoire) : toute modification de `backend/src/data/offres.json` est donc reflétée immédiatement, sans redémarrage du serveur.

En cas d'erreur de lecture/parsing : `500 { error: 'Impossible de charger les offres.' }`.

---

## 6. Charte graphique "Zitundo"

### 6.1 Palette (thème clair, `frontend/tailwind.config.js`)

| Token | Valeur | Usage |
|---|---|---|
| `primary` | `#1A3A5C` (bleu marine) | Liens actifs, icônes, mots-clés de titres, bordures de focus |
| `primary-dark` | `#0D2238` | Navbar (fond), titres principaux, dégradé `text-gradient` |
| `primary-light` | `#F0F5FA` | Fond de section (Hero, fond principal) |
| `accent` | `#E8714A` (corail) | Boutons principaux (CTA), badges promo, élément du logo |
| `accent-hover` | `#D9622B` | État hover des boutons/CTA |
| `cream` | `#F7F1E3` | Texte sur fond marine (navbar, logo) |
| `background` | `#F0F5FA` | Fond de page global |
| `card` | `#FFFFFF` | Fond des cartes |
| `card-hover` | `#EAF0F7` | Fond secondaire (zones internes de carte) |
| `border` | `#D0DCE8` | Bordures par défaut |
| `success` / `warning` / `error` | HSL inchangés depuis la v1 | États sémantiques (offert, alerte, erreur) — **jamais modifiés lors des refontes de palette** |

> Historique : la palette est passée par deux itérations avant le bleu marine actuel — thème sombre cyan/corail initial → thème clair teal/corail (`#1F6B5C`) → thème clair bleu marine (`#1A3A5C`, version actuelle).

### 6.2 Typographie

- Titres (`font-display`) : **Space Grotesk** (500/700).
- Texte courant (`font-sans`) : **DM Sans** (400/500/600/700).
- Chargées via `<link>` Google Fonts dans `index.html` (pas de self-hosting des polices actuellement).

### 6.3 Composants CSS (`@layer components` dans `index.css`)

`.btn-primary` (CTA corail), `.btn-secondary` (bordure marine), `.glass-card` (carte blanche + ombre), `.badge-*` (primary/accent/success/muted), `.input-field`, `.nav-link`, `.offer-selected-ring`, `.text-gradient` (dégradé `primary` → `primary-dark`).

**Règle de design établie** : aucune couleur codée en dur (hex/hsl/rgba) dans les composants `.tsx` — tout passe par les tokens Tailwind ou les classes `@layer components`, pour que les futures refontes de palette ne nécessitent qu'une modification de `tailwind.config.js` + `index.css`.

---

## 7. SEO

- Composant `PageSEO.tsx` (react-helmet-async) injecte `<title>`, `meta description`, `canonical`, `og:title`, `og:description`, `og:url` — un seul point de vérité par page, cohérence title/OG garantie structurellement.
- `BASE_URL` = `https://zitundo.com`.
- `index.html` contient les balises statiques par défaut (avant hydratation React) + Twitter Card, alignées sur la page d'accueil.
- `og-image.png` (1200×630, généré en HTML/CSS → capture Chromium headless) reproduit fidèlement le thème clair du site (navbar marine, fond clair, CTA corail).
- `sitemap.xml` : 5 routes (`/`, `/comparer`, `/simulateur`, `/migration`, `/eligibilite`).
- `robots.txt` : `Allow: /` sans restriction, référence le sitemap.

| Page | `<title>` | Meta description |
|---|---|---|
| Accueil | Comparez les offres Internet en France \| Zitundo | Comparez gratuitement les offres internet fibre et ADSL d'Orange, Free, SFR, Bouygues, Sosh, RED et B&You. Simulez le coût réel sur 24 mois. |
| Comparer | Comparateur Offres Internet Fibre & ADSL \| Zitundo | Filtrez et comparez 11 offres internet des principaux opérateurs français. Fibre ou ADSL, avec ou sans TV, avec ou sans engagement. |
| Simulateur | Simulateur de Coût Réel Internet sur 24 mois \| Zitundo | Calculez le coût total réel de votre abonnement internet sur 24 mois, frais cachés inclus (installation, activation, résiliation, location box). |
| Changer d'Opérateur | Changer d'Opérateur Internet sans coupure \| Zitundo | Changez de fournisseur internet en 4 étapes sans coupure de service. Récupérez votre RIO, souscrivez au nouveau FAI et gérez la transition sereinement. |
| Éligibilité | Tester mon Éligibilité Fibre & ADSL \| Zitundo | Vérifiez si la fibre optique est disponible à votre adresse en France. Résultats basés sur les données des opérateurs. |

---

## 8. Limites connues / dette technique

1. **`SimulateurTCO.tsx` n'est pas connecté à l'API** — utilise encore `frontend/src/data/offers.ts` (mock local), désynchronisé du jeu de données backend (`offres.json`) si celui-ci évolue.
2. **Éligibilité simulée, pas réelle** — aucun appel à une source officielle (ARCEP, API opérateurs) ; le résultat est un hash déterministe de l'adresse, à but de démonstration uniquement.
3. **Pas de base de données** — `offres.json` est un fichier statique versionné ; toute mise à jour des offres nécessite un commit/déploiement.
4. **Dépendances backend non utilisées** (auth, Postgres, Redis, logs) — scaffoldées dans `package.json` mais aucun code ne les importe.
5. **Domaine SEO** : `zitundo.com` est référencé partout, mais `og-image.png` doit être vérifié en conditions réelles une fois le site déployé (Sharing Debugger Facebook/LinkedIn).
6. **Pas de tests automatisés** (unitaires ou e2e) à ce stade.

---

## 9. Pistes d'évolution (non engagées)

- Connecter `SimulateurTCO` à `/api/offres` (même pattern que `Comparateur.tsx`).
- Remplacer la simulation d'éligibilité par un vrai appel à une API ARCEP ou opérateur.
- Persister les offres en base de données (le scaffolding `pg`/`sequelize` existe déjà côté backend).
- Tests responsive mobile complets sur les 5 pages.
- Déploiement Hostinger (build frontend statique + process Node backend, ou adaptation selon l'offre d'hébergement souscrite).
