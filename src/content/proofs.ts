/**
 * Section « Certifs & CTF » : tout ce qui se prouve.
 *
 * Les fichiers de certificats vont dans src/assets/ctf/. Après en avoir ajouté un,
 * lancer `npm run certificates` : un PDF reçoit un aperçu .webp, une image PNG/JPG
 * est convertie en .webp. Ici, on référence le PDF, ou le .webp pour une image.
 */

export const proofsIntro = {
  title: 'Prouvé en examen. Éprouvé en compétition.',
}

export type CertificateFile = {
  /** Nom du fichier dans src/assets/ctf/. */
  file: string
  /** Décrit le document pour qui ne le voit pas. */
  alt: string
}

/** ✓ terminé · ◐ en cours · ○ à planifier */
export type StepState = 'done' | 'progress' | 'todo'

type CertificationBase = {
  id: string
  issuer: string
  name: string
  title: string
  /** Domaines validés par l'examen. */
  domains: string[]
}

/**
 * Une certification est soit en préparation, soit obtenue. Une certification obtenue
 * exige un identifiant et un lien de vérification : sans eux, le build échoue.
 */
export type Certification =
  | (CertificationBase & {
      status: 'preparing'
      steps: { label: string; state: StepState }[]
    })
  | (CertificationBase & {
      status: 'earned'
      /** Date d'obtention : « 2027-03 » ou « 2027-03-14 ». */
      earnedOn: string
      credentialId: string
      verifyUrl: string
      writeupsUrl?: string
      certificate?: CertificateFile
    })

export const certifications: Certification[] = [
  {
    id: 'ejpt',
    status: 'preparing',
    issuer: 'INE Security',
    name: 'eJPT',
    title: 'Junior Penetration Tester',
    domains: [
      'Méthodologie d’évaluation',
      'Audit hôtes & réseau',
      'Pentest hôtes & réseau',
      'Pentest web',
    ],
    steps: [
      { label: 'Cours INE', state: 'done' },
      { label: 'Notes de modules', state: 'done' },
      { label: 'Skill Check Labs', state: 'done' },
      { label: 'Examen', state: 'todo' },
    ],
    // Le jour J, remplacer `status` et `steps` par :
    // status: 'earned',
    // earnedOn: '2027-03',
    // credentialId: '…',
    // verifyUrl: 'https://…',
    // writeupsUrl: 'https://…',
    // certificate: { file: 'ejpt.pdf', alt: 'Certificat eJPT de Mahamadou Alkerou' },
  },
]

/** Bloc « Sur le terrain ». Le nombre de CTF se calcule à partir du journal. */
export const field = {
  platform: 'TryHackMe',
  rank: 'Top 5 %',
  profileUrl: 'https://tryhackme.com/p/shadowsept',
}

export type Ctf = {
  name: string
  platform: string
  /** « 2026-08 », « 2026-08-14 », ou « TODO : … » tant qu'elle est inconnue. */
  date: string
  result: string
  certificate?: CertificateFile
  writeupUrl?: string
}

/** L'ordre n'a pas d'importance : le journal se trie par date, du plus récent au plus ancien. */
export const ctfs: Ctf[] = [
  {
    name: 'APSI-NE 2026',
    platform: '',
    date: '2026-09-25',
    result: '#15 · 23\u202f120 points · équipe dedsec',
  },
  {
    name: 'Hacker Holidays 2026',
    platform: 'TryHackMe',
    date: '2026-07-27',
    result: 'Challenge 12/14',
    certificate: {
      file: 'THM-AWW9BJVV9J.webp',
      alt: 'Certificat de participation, Hacker Holidays 2026 (TryHackMe)',
    },
  },
  {
    name: 'boroCTF 2026',
    platform: 'CyberAcad',
    date: '2026-06',
    result: '#554 · 400 points · équipe ZeroDay',
    certificate: {
      file: 'boroCTF-2026-certificate.webp',
      alt: 'Certificat de participation, boroCTF 2026 : 400 points, rang 554, équipe ZeroDay',
    },
  },
  {
    name: 'BroncoCTF 2026',
    platform: 'Santa Clara University',
    date: '2026-07-11',
    result: '#482 · 60 points · équipe ZeroDay Syndicate',
    certificate: {
      file: 'broncoCTF-2026-certificate.webp',
      alt: 'Certificat de réussite, BroncoCTF 2026 : 6 défis sur 45, 60 points, rang 482, équipe ZeroDay Syndicate',
    },
  },
  {
    name: 'Diver26',
    platform: 'OSINT',
    date: '2026-07-25',
    result: '#460 · 770 points',
  },
]
