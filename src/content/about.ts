
/** Contenu de la section « À propos ». */

export const about = {
  title: 'Je construis. Puis je cherche la faille.',
  paragraphs: [
    'Étudiant en Bachelor 4 informatique à Niamey, je suis développeur Full-Stack avec une forte orientation backend.',
    'Je conçois des applications web et des API en soignant la qualité du code, la sécurité et la performance.',
    'Côté sécurité offensive, je pratique les CTF, le pentest et l’analyse de vulnérabilités, et je m’entraîne régulièrement en environnement de laboratoire.',
  ],
  facts: [
    { label: 'Formation', value: 'Bachelor 4 Informatique' },
    { label: 'Localisation', value: 'Niamey, Niger' },
    { label: 'Développement', value: 'Full-Stack · Backend' },
    { label: 'Cybersécurité', value: 'Pentest · CTF' },
  ],
}

export type TerminalLine = { cmd: string; out: string }

/** Ce que tape le terminal affiché sur le moniteur 3D (et sa version HTML). */
export const terminal = {
  title: 'mahamadou@niamey: ~',
  lines: [
    { cmd: 'whoami', out: 'Mahamadou Alkerou Soumana' },
    { cmd: 'cat role.txt', out: 'Full-Stack Developer · Aspiring Pentester' },
    { cmd: 'cat formation.txt', out: 'Bachelor 4 Informatique, UIN (Niger)' },
    { cmd: 'ls skills/', out: 'django/  drf/  react/  flutter/  cybersecurity/' },
  ] satisfies TerminalLine[],
}
