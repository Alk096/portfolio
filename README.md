# Portfolio de Mahamadou Alkerou

Site personnel : développement full-stack orienté backend et sécurité offensive.
React, Vite, Tailwind CSS v4, React Three Fiber pour l’avatar et le bureau 3D, GSAP pour les animations.

## Lancer le projet

```sh
npm install
npm run dev       # serveur de développement
npm run build     # build de production dans dist/
npm run preview   # sert le build localement
npm run lint
```

## Modifier le contenu

Tout le texte du site vit dans `src/content/`, aucun composant à toucher :

| Fichier | Contenu |
| --- | --- |
| `site.ts` | Identité, accroche du hero, email, liens de navigation et réseaux |
| `about.ts` | Section À propos et lignes du terminal |
| `categories.ts` | Catégories communes à Projets et Compétences |
| `projects.ts` | Projets (un `featured: true` par catégorie s’affiche en grand) |
| `skills.ts` | Compétences et liste des technologies |
| `journey.ts` | Étapes du parcours |
| `contact.ts` | Textes du formulaire |
| `avatar.ts` | Modèle 3D et animation de l’avatar |

Un texte qui commence par `TODO` est encadré en pointillés avec `npm run dev`. Dans le build de production, un projet encore en `TODO` n’est pas affiché.

Les captures de projets vont dans `public/` et se référencent par leur chemin (`image: '/projects/nom.webp'`).

## Avatar

Le modèle est dans `public/models/avatar.glb`, compressé depuis `src/assets/avatar/model.glb`. Pour brancher une animation Mixamo, voir le commentaire de `src/content/avatar.ts`.

## Design

Les couleurs, typographies, rayons et ombres sont des tokens définis dans `src/index.css`. La 3D ne peut pas lire les variables CSS : ses couleurs sont reprises dans `src/three/palette.ts`.
