import type { CertificateFile } from './proofs'
import { isTodo } from './todo'

const urls = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('../assets/ctf/*.{pdf,webp}', { eager: true, query: '?url', import: 'default' }),
  ).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url]),
)

export type Certificate = {
  /** Le fichier d'origine, à ouvrir ou télécharger. */
  original: string
  /** L'image affichée dans l'aperçu. */
  preview: string
  fileName: string
  alt: string
}

/** Trouve le certificat et son aperçu. Si un fichier manque, il n'y a pas de bouton Certificat. */
export function resolveCertificate(certificate?: CertificateFile): Certificate | null {
  if (!certificate) return null
  const original = urls[certificate.file]
  const preview = certificate.file.endsWith('.pdf')
    ? urls[certificate.file.replace(/\.pdf$/, '.webp')]
    : original
  if (!original || !preview) {
    if (import.meta.env.DEV) {
      console.warn(`Certificat introuvable ou sans aperçu : ${certificate.file}. Lancer « npm run certificates ».`)
    }
    return null
  }
  return { original, preview, fileName: certificate.file, alt: certificate.alt }
}

const monthYear = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const fullDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

/** « 2026-08 » → « août 2026 » ; « 2026-08-14 » → « 14 août 2026 ». */
export function formatDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  const value = new Date(year, (month ?? 1) - 1, day ?? 1)
  return day ? fullDate.format(value) : monthYear.format(value)
}

/** Les plus récents d'abord ; une date encore inconnue passe en fin de liste, dans l'ordre du fichier. */
export function byDateDesc<T extends { date: string }>(items: T[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aTodo = isTodo(a.item.date)
      const bTodo = isTodo(b.item.date)
      if (aTodo || bTodo) return aTodo && bTodo ? a.index - b.index : aTodo ? 1 : -1
      return b.item.date.localeCompare(a.item.date)
    })
    .map(({ item }) => item)
}
