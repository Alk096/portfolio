import type { CategoryId } from './categories'

/**
 * Projets. Chaque projet appartient à une catégorie de `categories.ts`.
 * Dans une catégorie, le projet marqué `featured` est affiché en grand,
 * les autres en grille. Une catégorie sans projet affiche « Bientôt ».
 * Tout texte commençant par « TODO » est signalé visuellement sur le site.
 */
export type Project = {
  category: CategoryId
  title: string
  description: string
  /** Technos, dans leur casse officielle (FastAPI, PostgreSQL…). */
  tags: string[]
  /** Lien vers le dépôt ou la démo ; null masque le lien. */
  href: string | null
  /** Chemin d'une capture dans `public/` (ex. '/projects/api.webp') ; null affiche un emplacement vide. */
  image: string | null
  /** Affiché en grand, en tête de sa catégorie. */
  featured?: boolean
}

export const projectsIntro = {
  title: 'Projets',
}

export const projects: Project[] = [
  {
    category: 'web',
    featured: true,
    title: 'TODO : projet web vedette',
    description: 'TODO : en deux phrases, le problème, puis ce que tu as construit pour le résoudre.',
    tags: ['TODO'],
    href: null,
    image: null,
  },
  { category: 'web', title: 'TODO : projet web 2', description: 'TODO : description courte.', tags: ['TODO'], href: null, image: null },
  { category: 'web', title: 'TODO : projet web 3', description: 'TODO : description courte.', tags: ['TODO'], href: null, image: null },
  { category: 'mobile', title: 'TODO : projet mobile 1', description: 'TODO : description courte.', tags: ['TODO'], href: null, image: null },
  // Aucun projet « pentest » pour l'instant : la catégorie affiche l'état vide.
]
