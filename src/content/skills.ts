
import type { CategoryId } from './categories'

export type Skill = {
  category: CategoryId
  name: string
  detail: string
}

export const skillsIntro = {
  title: 'Build. Break. Secure.',
}

export const skills: Skill[] = [
  // WEB & BACKEND
  {
    category: 'web',
    name: 'Python',
    detail: 'Développement backend, automatisation et scripting.',
  },
  {
    category: 'web',
    name: 'Django',
    detail: 'Conception d’applications web et gestion de la logique métier.',
  },
  {
    category: 'web',
    name: 'Django REST Framework',
    detail: 'Développement d’API REST, authentification et gestion des permissions.',
  },
  {
    category: 'web',
    name: 'React',
    detail: 'Création d’interfaces web dynamiques avec React et TypeScript.',
  },
  {
    category: 'web',
    name: 'PostgreSQL',
    detail: 'Modélisation relationnelle, jointures, JSONB et optimisation SQL.',
  },
  {
    category: 'web',
    name: 'Node.js',
    detail: 'Développement de services backend avec Express et Fastify.',
  },
  {
    category: 'web',
    name: 'JavaScript / TypeScript',
    detail: 'Développement frontend et backend avec un typage structuré.',
  },

  // MOBILE
  {
    category: 'mobile',
    name: 'Flutter',
    detail: 'Développement d’applications mobiles multiplateformes.',
  },
  {
    category: 'mobile',
    name: 'Dart',
    detail: 'Programmation et structuration d’applications Flutter.',
  },
  {
    category: 'mobile',
    name: 'Android SDK',
    detail: 'Configuration des environnements Android et tests sur émulateurs.',
  },

  // CYBERSÉCURITÉ OFFENSIVE
  {
    category: 'pentest',
    name: 'Penetration Testing Methodology',
    detail: 'Application d’une méthodologie structurée de test d’intrusion, de la définition du périmètre à la validation des vulnérabilités.',
  },
  {
    category: 'pentest',
    name: 'OSINT & Information Gathering',
    detail: 'Collecte, corrélation et analyse d’informations sur une cible à partir de sources publiques et de techniques de reconnaissance.',
  },
  {
    category: 'pentest',
    name: 'Network Reconnaissance & Enumeration',
    detail: 'Découverte des hôtes, scan des ports, identification des services et énumération des systèmes et ressources réseau.',
  },
  {
    category: 'pentest',
    name: 'Vulnerability Assessment & Exploitation',
    detail: 'Identification, analyse et exploitation contrôlée de vulnérabilités pour évaluer leur impact sur les systèmes ciblés.',
  },
  {
    category: 'pentest',
    name: 'System Enumeration & Privilege Escalation',
    detail: 'Analyse des utilisateurs, permissions, processus et configurations afin d’identifier des possibilités d’élévation de privilèges.',
  },
  {
    category: 'pentest',
    name: 'Password & Credential Attacks',
    detail: 'Analyse des identifiants, attaques par dictionnaire et force brute, ainsi que cassage de hashes.',
  },
  {
    category: 'pentest',
    name: 'Pivoting & Lateral Movement',
    detail: 'Exploration de réseaux internes, redirection de ports et déplacement entre systèmes accessibles.',
  },
  {
    category: 'pentest',
    name: 'Web Application & CMS Security Testing',
    detail: 'Reconnaissance des applications web, découverte de contenus, analyse des mécanismes d’authentification et recherche de vulnérabilités dans les applications et CMS.',
  },
]

export const technologies = [
  'Python',
  'Django',
  'DRF',
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Flutter',
  'Git',
  'Linux',
  'Network Reconnaissance',
  'OSINT',
  'Exploitation',
  'Privilege Escalation',
  'Web Pentesting',
  'Network Pentesting',
  'Pivoting',
]
