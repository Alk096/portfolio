/** Contenu encore à remplir : tout texte qui commence par « TODO ». */
export function isTodo(text: string) {
  return text.startsWith('TODO')
}

/**
 * Les emplacements TODO ne s'affichent qu'en développement (`npm run dev`).
 * Dans le build de production, un projet encore en TODO est masqué.
 */
export const showDrafts = import.meta.env.DEV
