
/** Parcours : de la plus ancienne étape à « Aujourd’hui ». */

export type JourneyStep = {
  period: string
  title: string
  text: string
}

export const journeyIntro = {
  title: 'De la programmation à la cybersécurité offensive',
}

export const journey: JourneyStep[] = [
  {
    period: '2023',
    title: 'Début du parcours universitaire',
    text: 'Début de mes études en informatique à l’Université Islamique du Niger. Acquisition des fondamentaux de la programmation, des systèmes informatiques et de l’algorithmique.',
  },
  {
    period: '2024',
    title: 'Développement logiciel',
    text: 'Exploration du développement web et logiciel, approfondissement de la programmation, des bases de données et de la conception d’applications.',
  },
  {
    period: '2025',
    title: 'Premières expériences professionnelles',
    text: 'Développement d’applications et d’API. Début de mon immersion dans la cybersécurité offensive à travers les CTF, TryHackMe et les environnements de laboratoire.',
  },
  {
    period: '2026',
    title: 'Développeur Full-Stack & préparation eJPT',
    text: 'Expérience professionnelle dans le développement logiciel, préparation de la certification eJPT et approfondissement de mes compétences en tests d’intrusion. Actuellement en dernière année de Bachelor Informatique à l’UIN, avec un intérêt particulier pour la sécurité des applications et le pentest.',
  },
  {
    period: 'Aujourd’hui',
    title: 'Construire, sécuriser et apprendre',
    text: 'Je poursuis mon évolution en développement Full-Stack et en cybersécurité offensive. Je travaille sur des projets concrets, prépare mon mémoire de fin d’études et développe mes compétences en audit de sécurité et en tests d’intrusion.',
  },
]
