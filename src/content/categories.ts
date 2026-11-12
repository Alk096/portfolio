/**
 * Catégories communes aux sections Skills et Projets.
 *
 * Ajouter une catégorie = ajouter une ligne ici. Un bouton apparaît alors
 * dans les deux sections, et l'identifiant devient utilisable dans
 * `skills.ts` et `projects.ts` (TypeScript signale toute faute de frappe).
 */
export const categories = [
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'pentest', label: 'Pentest' },
] as const

export type CategoryId = (typeof categories)[number]['id']

/** Texte de l'état vide, quand une catégorie n'a encore aucun contenu. */
export const emptyState = {
  title: 'Bientôt',
  skills: 'Les compétences de cette catégorie arrivent.',
  projects: 'Les projets de cette catégorie arrivent.',
}
