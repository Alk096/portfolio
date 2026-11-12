/**
 * Couleurs de la 3D et du terminal dessiné en canvas.
 * Ni WebGL ni un canvas 2D ne lisent les variables CSS : ces valeurs reprennent
 * les tokens de `index.css` (même nom), à modifier aux deux endroits.
 */
export const tokens = {
  bg000: '#07080c',
  bg200: '#141824',
  lineStrong: '#5b6482',
  ink: '#eef0f6',
  inkMuted: '#9aa1b5',
  inkFaint: '#7d859b',
  amber: '#ffb547',
  violet: '#8f84ff',
  mint: '#3ef2b0',
}

/** Éclairage : une clé chaude, un ciel froid, un sol brun qui réchauffe les ombres. */
export const light = {
  key: '#ffe6c8',
  sky: '#dfe4ff',
  ground: '#2a2018',
  screen: '#aab6ff',
}

/** Matériaux mats du setup PC, par thème. */
export const deskMaterials = {
  night: { desk: '#1d2232', body: '#171c2b', bodyHi: '#252c42', keys: '#0d0f16', edge: '#3b4463' },
  day: { desk: '#d6d1c4', body: '#f1eee7', bodyHi: '#fffdf8', keys: '#c9c4b6', edge: '#9498a6' },
}

/** Fond du terminal, un cran sous bg-000 pour que l'écran allumé se détache du boîtier. */
export const terminalBackground = '#0a0c12'
