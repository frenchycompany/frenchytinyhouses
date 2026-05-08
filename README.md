# Frenchy Tiny Houses

Site officiel de **Frenchy Tiny Houses** (groupe Frenchy Company, Compiègne).

Pour la vision, les contraintes et les règles de décision : **lire `CLAUDE.md`**.
C'est la single source of truth du projet.

## Stack

- [Astro](https://astro.build) (statique)
- [Tailwind CSS](https://tailwindcss.com)
- React (pour les composants interactifs : simulateur, dashboard investisseurs)
- TypeScript

## Démarrage

```bash
npm install
cp .env.example .env.local   # remplir si besoin
npm run dev                  # http://localhost:4321
```

## Scripts

| Commande         | Action                                  |
| ---------------- | --------------------------------------- |
| `npm run dev`    | Serveur de dev avec HMR                 |
| `npm run build`  | Build statique dans `dist/`             |
| `npm run preview`| Sert le build local pour vérification   |
| `npm run check`  | Type-check + diagnostics Astro          |

## Structure

Voir `CLAUDE.md` §4 pour la structure cible complète.

## Déploiement

Pipeline GitHub Actions → VPS (rsync SSH).
La procédure complète et la gestion des secrets sont décrites dans `CLAUDE.md` §11.

## Identité visuelle

Palette, typographie et voix éditoriale dans `CLAUDE.md` §5.
**Ne pas modifier sans validation explicite** — le dossier de levée est imprimé
et le site doit rester visuellement raccord.

## Licence

Privé / propriétaire — Frenchy Company SAS.
