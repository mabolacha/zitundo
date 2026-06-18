# Guide de déploiement Zitundo — Vercel + Render

## Prérequis
- Projet pushé sur GitHub : https://github.com/mabolacha/zitundo
- Compte GitHub actif
- Comptes Vercel et Render à créer (gratuits)

---

## ÉTAPE 1 — Préparer le projet

Dans Claude Code, exécute ce prompt :

```
Crée un fichier vercel.json à la racine du projet avec ce contenu :

{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "echo 'skip root install'"
}

Vérifie aussi que backend/package.json contient bien un script "start" :
"scripts": {
  "start": "node dist/server.js",
  "build": "tsc"
}

Puis : git add . && git commit -m "Config déploiement Vercel + Render" && git push
```

---

## ÉTAPE 2 — Déployer le frontend sur Vercel

1. Va sur **vercel.com**
2. Clique **"Sign Up"** → choisis **"Continue with GitHub"**
3. Autorise Vercel à accéder à tes repos GitHub
4. Clique **"Add New Project"**
5. Sélectionne le repo **mabolacha/zitundo**
6. Vercel détecte automatiquement le fichier `vercel.json` — ne modifie rien
7. Clique **"Deploy"**
8. Attends 2-3 minutes — Vercel te donne une URL type `https://zitundo.vercel.app`

> 💡 Note cette URL, elle sera nécessaire à l'étape 3.

---

## ÉTAPE 3 — Déployer le backend sur Render

1. Va sur **render.com**
2. Clique **"Get Started"** → **"Sign Up with GitHub"**
3. Autorise Render à accéder à tes repos
4. Clique **"New +"** → **"Web Service"**
5. Sélectionne le repo **mabolacha/zitundo**
6. Configure le service :

| Champ | Valeur |
|---|---|
| Name | zitundo-api |
| Root Directory | backend |
| Environment | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Instance Type | Free |

7. Clique **"Advanced"** → **"Add Environment Variable"** :

| Clé | Valeur |
|---|---|
| PORT | 5001 |
| FRONTEND_URL | https://zitundo.vercel.app (ton URL Vercel) |

8. Clique **"Create Web Service"**
9. Attends 3-5 minutes — Render te donne une URL type `https://zitundo-api.onrender.com`

> ⚠️ Sur le plan gratuit Render, le backend se met en veille après 15 min d'inactivité. La première requête après une pause prend ~30 secondes. Acceptable pour démarrer.

---

## ÉTAPE 4 — Connecter le frontend au backend

Une fois l'URL Render connue (ex: `https://zitundo-api.onrender.com`), donne ce prompt à Claude Code :

```
Dans le frontend, configure l'URL de l'API via une variable d'environnement Vite :

1. Crée frontend/.env.production avec :
VITE_API_URL=https://zitundo-api.onrender.com

2. Crée frontend/.env.development avec :
VITE_API_URL=http://localhost:5001

3. Dans tous les appels axios vers /api/offres, remplace l'URL en dur par :
import.meta.env.VITE_API_URL + '/api/offres'

4. Ajoute frontend/.env.production dans .gitignore
(les variables d'env de prod seront configurées directement dans Vercel)

Fais git add . && git commit -m "Config API URL via variable d'environnement" && git push
```

---

## ÉTAPE 5 — Ajouter la variable d'environnement dans Vercel

1. Va sur **vercel.com** → ton projet Zitundo
2. **Settings** → **Environment Variables**
3. Ajoute :

| Clé | Valeur |
|---|---|
| VITE_API_URL | https://zitundo-api.onrender.com |

4. Clique **Save**
5. Va dans **Deployments** → clique **Redeploy** sur le dernier déploiement

---

## ÉTAPE 6 — Vérifier que tout fonctionne

1. Ouvre l'URL Vercel dans ton navigateur
2. Va sur `/comparer` — les 18 offres doivent s'afficher
3. Ouvre les outils développeur (F12) → onglet **Network**
4. Vérifie qu'une requête vers `https://zitundo-api.onrender.com/api/offres` renvoie bien un statut 200
5. Teste le simulateur de coût réel avec une offre

---

## ÉTAPE 7 — Acheter et configurer le domaine zitundo.com

### Achat du domaine
- Va sur **OVH.com** ou **Namecheap.com**
- Recherche `zitundo.com` (~10€/an)
- Achète et note les accès au panneau de gestion DNS

### Configuration sur Vercel
1. Dans ton projet Vercel → **Settings** → **Domains**
2. Clique **"Add Domain"** → saisis `zitundo.com`
3. Vercel te donne deux enregistrements DNS à ajouter chez ton registrar :
   - Type **A** : pointe vers l'IP Vercel
   - Type **CNAME** : `www` pointe vers `cname.vercel-dns.com`
4. Ajoute ces enregistrements dans le panneau DNS de ton registrar (OVH/Namecheap)
5. Attends 15-30 min (propagation DNS)
6. Vercel détecte automatiquement et active le certificat SSL (HTTPS)

### Mettre à jour FRONTEND_URL sur Render
Une fois le domaine actif :
1. Va sur Render → ton service zitundo-api
2. **Environment** → modifie `FRONTEND_URL` : `https://www.zitundo.com`
3. Render redéploie automatiquement

---

## ÉTAPE 8 — Mettre à jour Google Analytics

1. Va sur **analytics.google.com**
2. **Administration** → **Flux de données** → ton flux Zitundo
3. Vérifie que l'URL du flux est bien `https://www.zitundo.com`
4. Dans Claude Code :
```
Vérifie que le script GA4 (G-SN475MDZ82) est bien présent dans frontend/index.html
et que l'URL de référence est à jour.
```

---

## Workflow de mise à jour après déploiement

### Mettre à jour les offres
1. Copier-coller Que Choisir dans Claude Code avec le prompt du PROCESS-MAJ-OFFRES.md
2. Claude Code modifie `offres.json` et fait `git push`
3. Render redéploie automatiquement le backend (~2 min)
4. Les nouvelles offres sont en ligne

### Ajouter un article de blog
1. Demander à Claude Code de l'ajouter dans `frontend/src/data/articles.ts`
2. Claude Code fait `git push`
3. Vercel redéploie automatiquement le frontend (~1 min)

---

## Résolution des problèmes courants

### Le comparateur est vide
→ Le backend Render est en veille. Attends 30 secondes et recharge la page.

### Erreur CORS
Dans Claude Code :
```
Dans backend/src/server.ts, vérifie que CORS autorise bien l'origine https://www.zitundo.com en plus de localhost:3000.
```

### Le domaine ne fonctionne pas
→ La propagation DNS peut prendre jusqu'à 48h. Vérifie sur **whatsmydns.net** que les enregistrements sont bien propagés.

### Redéployer manuellement
- **Vercel** : Deployments → Redeploy
- **Render** : Dashboard → Manual Deploy

---

## Récapitulatif des URLs

| Service | URL |
|---|---|
| Frontend (Vercel) | https://www.zitundo.com |
| Backend API (Render) | https://zitundo-api.onrender.com |
| API offres | https://zitundo-api.onrender.com/api/offres |
| Google Analytics | G-SN475MDZ82 |
| Repo GitHub | https://github.com/mabolacha/zitundo |

---

*Guide rédigé le 18 juin 2026*
