import type { Brand } from '../components/BrandIcon'

/**
 * Tout le contenu éditable du site vit dans `src/content/`.
 * Modifier un texte ici ne demande de toucher à aucun composant.
 */

export const identity = {
  firstName: 'Mahamadou',
  lastName: 'Alkerou',
  /** Monogramme affiché dans la navigation, suivi d'un point ambre. */
  monogram: 'MA',
  tagline:
    'Je conçois des applications web et des API, puis je cherche leurs failles. Développeur orienté backend, en préparation de la certification eJPT en sécurité offensive.',
  /** false masque le statut sous les boutons du hero. */
  available: true,
  availableLabel: 'Ouvert aux opportunités professionnelles',
  /** TODO : ton adresse publique. Le formulaire de contact écrit à cette adresse ; tant qu'elle manque, les messages n'arrivent nulle part. */
  email: 'TODO@example.com',
}

export const heroActions = {
  primary: { label: 'Découvrir mes projets', href: '#projets' },
  secondary: { label: 'Me contacter', href: '#contact' },
}

/**
 * Bouton de téléchargement du CV, dans le hero.
 * Le PDF se dépose dans `src/assets/cv/` (un seul fichier) : le bouton apparaît alors tout seul.
 * `fileName` est le nom sous lequel le visiteur l'enregistre.
 */
export const cv = {
  label: 'Télécharger mon CV',
  fileName: 'CV-Mahamadou-Alkerou.pdf',
}

export const navLinks = [
  { label: 'À propos', href: '#a-propos' },
  { label: 'Projets', href: '#projets' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Parcours', href: '#parcours' },
  { label: 'Certifs & CTF', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

/** Liens du pied de page. */
export const socials: { label: string; brand: Brand; href: string }[] = [
  { label: 'GitHub', brand: 'github', href: 'https://github.com/Alk096' },
  { label: 'LinkedIn', brand: 'linkedin', href: 'https://www.linkedin.com/in/mahamadou-alker-a4a815233/' },
]
