# CLAUDE.md — Frenchy Tiny Houses

> **À toi, Claude Code, qui lit ce fichier à chaque démarrage de session.**
> Ce document est la **single source of truth** du projet. Il définit la vision,
> les contraintes, et les règles de décision. Quand tu hésites entre deux options,
> reviens ici.
>
> **Fichier vivant** — à mettre à jour au fil des décisions structurantes.

---

## 1. Le projet en 30 secondes

**Frenchy Tiny Houses** (frenchytinyhouses.fr) est une marque du groupe
**Frenchy Company** (Compiègne), portée par Raphaël Jacquet. Elle commercialise
des Tiny Houses de **18 m²** (modèle Everbox) installées chez des **particuliers
propriétaires de leur terrain**, avec **gestion locative intégrale** assurée par
**Frenchy Conciergerie** (entité sœur, déjà en exploitation : 20+ propriétés
sous gestion, Cartes T et G, première Tiny House installée et exploitée).

**Cible 2027** : 100 unités déployées sur le territoire français.
**Levée en cours** : 150 000 € en SAS dédiée, format BSA-AIR (cap 1 M€, décote 20 %).

Le site web est **l'extension naturelle** d'un écosystème entrepreneurial déjà
construit. Pas un MVP qui cherche son marché. Un produit qui structure une
mécanique commerciale et opérationnelle existante.

**Tagline éditoriale** : *« Posez. Louez. Encaissez. »* (à valider — voir §5)

---

## 2. Les trois zones du site
serveur vps : 87.106.246.151
dossier : /var/www/frenchytinyhouses/
bdd sql : 87.106.246.151
login : root
mot de passe : **Baycpq25**

Le site se structure en **trois zones distinctes** avec des audiences, des
objectifs de conversion, et des niveaux d'accès différents.

### 2.1 — Zone commerciale (publique)

**URL** : `/`, `/concept`, `/produit`, `/offres`, `/simulateur`, `/pourquoi-nous`, `/contact`

**Audience** : particuliers propriétaires d'un terrain, susceptibles d'installer
une Tiny House dans leur fond de jardin pour générer un revenu locatif.

**Objectif unique** : remplir un **formulaire de contact qualifiant**
(localisation, surface terrain, accessibilité). Tout le reste est un moyen.

**Pages clés** :
- **Home** — héro fort, value prop, 3 KPI (29 999 €, ~780 €/mois, garantie 10 ans), CTA simulateur
- **Le Concept** — comment ça marche, pour qui (le particulier, pas le campeur)
- **Produit** — fiche technique + équipement éco (4 panneaux solaires + récup eau)
- **Offres** — les 3 cartes (vente sèche / partenariat gestion / location terrain)
- **Simulateur** ★ — *l'outil de conversion principal* (voir §3)
- **Pourquoi nous** — les 3 raisons + argument d'exécution
- **Contact** — formulaire qualifiant ; **JAMAIS** un simple email mailto

### 2.2 — Zone gestion (propriétaires)

**URL** : `/gestion/*` (auth requise)

**Audience** : propriétaires ayant déjà une Tiny House installée et en gestion.

**Objectif** : transparence totale sur leur actif. Le client doit pouvoir voir
en un coup d'œil ce que son module a généré ce mois-ci, sans appeler personne.

**Vues à terme** :
- Tableau de bord du module (occupation, revenu net du mois, prochaines
  réservations anonymisées)
- Historique des virements
- Maintenance et incidents
- Avis voyageurs (Airbnb / Booking agrégés)
- Documents administratifs (contrat, factures)
- Messagerie avec Frenchy Conciergerie

**Important** : cette zone est *aussi la source de données* qui alimentera la
zone investisseurs (voir §3). Penser le schéma de données dans cette optique
dès le début.

### 2.3 — Zone investisseurs (gated)

**URL** : `/investisseurs/*` (gate à minima — password partagé en v1, auth réelle en v2)

**Audience** : investisseurs prospects pour la levée BSA-AIR + investisseurs
existants après closing.

**Contenu** :
- Le dossier de levée (HTML + PDF, en FR/EN/RU/ZH — déjà produits, dans `/assets/dossier/`)
- **Dashboard opérationnel live** ★ (voir §3 — c'est là qu'est le pari)
- Updates trimestriels (markdown simples)
- Documents juridiques (term sheet, statuts SAS, etc.)

---

## 3. Le pari différenciant : l'outil fonctionnel pour investisseurs

C'est **l'élément qui distingue Frenchy Tiny Houses des projets early-stage
classiques**. La plupart des dossiers de levée présentent des projections.
Le nôtre montre **une opération réelle qui tourne**.

### Le simulateur (côté commercial)

Outil 100 % client-side (pas de backend). L'utilisateur entre :
- Localisation (CP) → estime saisonnalité et tarifs
- Surface terrain disponible (m²)
- Accessibilité (oui/non, < 50 m de la route)

Calcule en sortie :
- Revenu brut mensuel estimé
- Revenu net propriétaire estimé (après commission 20 % + plateforme 15 %)
- Rentabilité annuelle
- Comparaison avec offres 1 / 2 / 3

Les hypothèses doivent être **conservatrices** (cf. dossier : 1 200 €/mois brut
estimation basse). Toujours afficher la mention « estimation, sans garantie ».

**CTA en sortie** : « Demander une étude personnalisée » → formulaire qualifiant.

### Le dashboard investisseurs (côté investor relations)

C'est le **deuxième outil**, et c'est lui qui change la nature du dossier.

**Phase 1** (lancement avec mock data) :
- Carte de France avec les unités déployées et en pipeline
- Compteurs : `nb_installées` / `nb_en_pipeline` / `nb_signées` / `revenu_cumulé_YTD`
- Funnel de conversion : prospects → études → contrats → installations
- Feed d'activité (anonymisé) : « Unité #001 — Compiègne — 78 % d'occupation
  en mars » / « Nouveau contrat signé en région PACA »

**Phase 2** (data réelle, branchée sur la zone gestion) :
- Mêmes vues, alimentées par la base de données de production
- Revenue per unit live (vs hypothèse 780 € net du dossier)
- Cohortes par mois d'installation
- KPIs financiers SAS (CA, marge brute, runway)

**Pourquoi c'est puissant** : un investisseur peut, depuis son canapé, vérifier
que la machine tourne. Même avec 1 ou 2 unités, c'est plus convaincant que
n'importe quel pitch deck. Au fil du déploiement, le dashboard devient
auto-démonstratif.

**Architecture** : le dashboard v1 peut être 100 % statique avec données mockées
dans un JSON commité. Pas de backend nécessaire. La phase 2 viendra plus tard.

---

## 4. Stack technique

### Choisi
- **Astro** (framework principal, output statique)
- **Tailwind CSS** + variables CSS pour les tokens de marque
- **i18n** : FR par défaut, puis EN/RU/ZH (le contenu existe déjà, voir `/assets/dossier/`)
- **Composants interactifs** : React via `@astrojs/react` (uniquement pour le
  simulateur et le dashboard, le reste reste en .astro pur)
- **Hosting** : VPS sous nginx, déploiement via GitHub Actions (rsync SSH)
- **Domaine** : frenchytinyhouses.fr (HTTPS via Let's Encrypt / certbot)
- **Formulaires** : Tally ou Formspree en v1 (zéro backend). À internaliser
  uniquement quand le volume le justifie.
- **Analytics** : Plausible ou Umami (RGPD-friendly, sans bandeau cookie pénible)

### Refusé / différé
- ❌ Pas de Next.js / SSR : on n'en a pas besoin et ça complexifie le déploiement
- ❌ Pas de CMS headless (Strapi, Sanity, etc.) en v1 : le contenu vit dans le repo
- ❌ Pas de backend custom avant phase 2 du dashboard
- ❌ Pas de base de données avant la zone gestion (phase 3)
- ❌ Pas de Docker pour le moment : nginx sert du statique, c'est tout

### Structure repo cible

```
/
├── CLAUDE.md                    ← ce fichier
├── README.md                    ← onboarding humain
├── astro.config.mjs
├── tailwind.config.cjs
├── package.json
├── public/
│   ├── frenchy-cover.jpg        ← image de couverture du dossier
│   └── og/                      ← images Open Graph
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── KpiBlock.astro
│   │   ├── OfferCard.astro
│   │   ├── Simulator.tsx        ← React, client:load
│   │   └── investor/
│   │       └── Dashboard.tsx    ← React, mock data en v1
│   ├── content/                 ← Markdown des pages éditoriales
│   │   ├── concept/
│   │   ├── produit/
│   │   └── ...
│   ├── pages/
│   │   ├── index.astro          ← /
│   │   ├── concept.astro        ← /concept
│   │   ├── ...
│   │   ├── investisseurs/
│   │   │   ├── index.astro
│   │   │   └── dashboard.astro
│   │   └── en/, ru/, zh/        ← versions traduites
│   ├── data/
│   │   ├── investor-mock.json   ← data du dashboard v1
│   │   └── pricing.json
│   └── i18n/
│       └── ui.json
├── assets/
│   └── dossier/
│       ├── frenchy_tiny_houses_dossier_fr.html
│       ├── frenchy_tiny_houses_dossier_en.html
│       ├── frenchy_tiny_houses_dossier_ru.html
│       └── frenchy_tiny_houses_dossier_zh.html
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 5. Identité visuelle

**Charte cohérente avec le dossier de levée** (référentiel : `assets/dossier/*.html`).
Le site doit donner l'impression d'être l'extension naturelle du dossier, pas un
univers parallèle.

### Palette (Tailwind config)

```js
colors: {
  gold:       '#b8924a',
  'gold-light':'#d4b06a',
  dark:       '#1a1a1a',
  ink:        '#2b2b2b',
  paper:      '#ffffff',
  soft:       '#f4f1ec',  // background page
  line:       '#d8cfbf',
  leaf:       '#4a6b3a',  // pour les éléments éco
  'leaf-light':'#6d8c5a',
}
```

### Typographie

- **Cormorant Garamond** (titres, lead text) — Google Fonts, weights 300/400/600
- **DM Mono** (labels, KPI, navigation, footers) — Google Fonts, weights 400/500
- Body text : `font-serif` (Cormorant) en `text-[11.5pt]` ou équivalent
- Préférer **letterspacing élargi** (`tracking-[0.2em]`) sur les labels en mono
  pour rappeler la signature graphique du dossier

### Voix éditoriale

- **Sobre, factuel, élégant**. Jamais hype, jamais startup-bro.
- **Le chiffre est l'argument**. Préférer « 9 360 € de revenu net annuel » à
  « rentabilité exceptionnelle ».
- **Ne pas survendre**. Le dossier dit « estimation basse » — le site doit dire
  pareil.
- **Toujours concret**. Pas de « solutions innovantes » ; dire ce que c'est
  vraiment (« 18 m² posés en un mois sur dalle isolée »).
- Phrases courtes en titres, paragraphes courts dans le corps.

### Composants visuels signatures (à reprendre du dossier)

- Bordures fines or (`border-gold/30`) sur les cartes
- Tableaux avec `border-top` et `border-bottom` or, lignes intermédiaires en `line`
- Badges « Confidentiel », « Avantage Partenariat » en mono majuscules tracking large
- Numérotation de section en mono : `— 01 / 07`

---

## 6. Roadmap par phases

Une phase ne démarre pas tant que la précédente n'est pas livrée et stable.

### Phase 1 — MVP commercial (semaine 1-2)
**Objectif** : avoir un site live qui capte des leads.
- [ ] Scaffolding Astro + Tailwind + i18n
- [ ] Layout de base (header, footer, sélecteur de langue)
- [ ] Pages : Home, Concept, Produit, Offres, Pourquoi-nous, Contact
- [ ] Formulaire Tally branché (qualification terrain)
- [ ] Page `/investisseurs` simple avec accès au dossier (HTML + PDF)
- [ ] Déploiement GitHub Actions → VPS
- [ ] HTTPS + DNS frenchytinyhouses.fr
- [ ] Pages SEO basiques (meta, OG, sitemap, robots.txt)
- [ ] Plausible/Umami analytics

### Phase 2 — Simulateur (semaine 3)
**Objectif** : maximiser la conversion.
- [ ] Composant React `Simulator.tsx` côté client
- [ ] Modèle de calcul (paramètres dans `data/pricing.json`)
- [ ] Page `/simulateur` dédiée
- [ ] Intégration CTA simulateur → formulaire pré-rempli

### Phase 3 — Dashboard investisseurs (mock) (semaine 4)
**Objectif** : montrer aux investisseurs que la machine tourne.
- [ ] Page `/investisseurs/dashboard` (gate password partagé)
- [ ] Carte de France avec marqueurs unités/pipeline
- [ ] KPI cards (compteurs, funnel)
- [ ] Feed d'activité (mock data dans JSON)
- [ ] Mode "live" stylisé (timestamps relatifs, animation discrète)

### Phase 4 — Versions traduites (semaine 5)
- [ ] Routes `/en/`, `/ru/`, `/zh/`
- [ ] Réutilisation du contenu du dossier déjà traduit
- [ ] Vérif rendu CJK (fonts fallback)

### Phase 5+ — Auth + données réelles (post-levée)
- [ ] Backend léger (Hono + SQLite ou Supabase) pour la zone gestion
- [ ] Auth propriétaires (magic link)
- [ ] Synchro Airbnb/Booking → dashboard owner
- [ ] Le dashboard investisseurs bascule sur data réelle agrégée

---

## 7. Conventions

### Code
- **TypeScript** par défaut pour les composants React
- **Astro components** (.astro) pour tout ce qui est statique
- Pas de CSS-in-JS : Tailwind + classes, point.
- Variables CSS pour les tokens de marque (au cas où on les utilise hors Tailwind)
- Composants nommés en PascalCase, fichiers en kebab-case dans `/pages`

### i18n
- Clés en kebab-case, namespacées par page : `home.hero.title`, `concept.lead`
- Les chaînes longues (paragraphes) vont en Markdown dans `src/content/`,
  avec un dossier par langue
- Ne JAMAIS dupliquer de texte entre le site et le dossier — `assets/dossier/`
  reste la source de vérité du contenu de levée

### Git
- Branches : `main` (prod) + `dev` (staging) + features sous `feat/...`
- Commits en anglais, format conventionnel : `feat:`, `fix:`, `chore:`, `docs:`
- Un PR par feature, pas de push direct sur `main`

### Performance (non-négociable)
- Lighthouse mobile > 90 sur toutes les pages
- Images en WebP/AVIF + `loading="lazy"` par défaut
- Pas de framework JS chargé sur les pages statiques (Astro `client:` directives
  uniquement où nécessaire — simulateur, dashboard, sélecteur langue)
- Total JS sur la home < 30 kB gzipped

---

## 8. À ne pas faire (red flags)

- ❌ **Ne pas changer la palette ou la typographie** sans validation explicite.
  Le dossier est imprimé, distribué, montré à des investisseurs. Le site doit
  être visuellement raccord.
- ❌ **Ne pas générer d'images de personnes par IA**. Si on a besoin de visuels
  humains, on shoot ou on ne montre pas. Les investisseurs détectent.
- ❌ **Ne pas inventer de chiffres**. Tous les nombres sur le site doivent
  venir du dossier ou de données validées. En cas de doute, on demande.
- ❌ **Ne pas afficher de témoignages fictifs**. Si on a 1 client, on en montre 1.
  Pas 12 photos stock avec des prénoms inventés.
- ❌ **Ne pas industrialiser prématurément**. Si une page peut être en HTML pur,
  elle reste en HTML pur. Pas de système de gestion de contenu pour 8 pages.
- ❌ **Ne pas proposer le simulateur sans formulaire en sortie**. Le simulateur
  qui ne convertit pas est un gaspillage.
- ❌ **Ne pas exposer la zone gestion ou investisseurs sans gate**, même
  pendant le dev. Les routes en construction sont en `noindex` + password.
- ❌ **Ne pas mentionner le terme « partenaires » ou « franchise »** : ce sont
  des particuliers propriétaires, pas un réseau commercial. Vocabulaire précis.

---

## 9. Décisions ouvertes (à trancher avec Raphaël)

- [ ] Tagline officielle (proposition : *« Posez. Louez. Encaissez. »*)
- [ ] Choix du formulaire : Tally vs Formspree vs Cal.com pour les RDV
- [ ] Faut-il une page blog/journal pour SEO long terme ?
- [ ] Espace gestion : web app dédiée ou intégrée au site ?
- [ ] Newsletter investisseurs (Buttondown, Resend, ou rien) ?

---

## 10. Référentiels

- **Dossier de levée** : `assets/dossier/frenchy_tiny_houses_dossier_*.html`
  (FR/EN/RU/ZH — produits, validés, ne pas modifier sans accord)
- **Image de couverture** : `public/frenchy-cover.jpg`
- **Frenchy Conciergerie** : entité opérationnelle existante (référence pour
  le ton, l'expertise, la preuve d'exécution)
- **Modèle Everbox** : produit physique (panneaux PVC 38 mm, garantie 10 ans,
  601 × 308 cm)

---

*Dernière mise à jour : 8 mai 2026.*
*Mainteneur : Raphaël Jacquet — Frenchy Company, Compiègne.*
