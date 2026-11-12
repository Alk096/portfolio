
/** Section Contact. Le formulaire ouvre l'application mail du visiteur (mailto:). */
export const contact = {
  eyebrow: 'Contact',
  title: 'Un projet, une opportunité ou une collaboration ? Parlons-en.',
  fields: {
    name: {
      label: 'Nom',
      placeholder: 'Ton nom',
      error: 'Indique ton nom.',
    },
    email: {
      label: 'Email',
      placeholder: 'toi@exemple.com',
      error: 'Indique une adresse email valide.',
    },
    message: {
      label: 'Message',
      placeholder: 'Décris ton projet, ton besoin ou ton idée.',
      error: 'Écris un message.',
    },
  },
  submit: 'Envoyer le message',
  /** Objet du mail généré ; {name} est remplacé par le nom saisi. */
  subject: 'Prise de contact — {name}',
  success: 'Ton application mail s’ouvre avec le message prêt à envoyer.',
}
