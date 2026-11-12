/**
 * Réglages de l'avatar 3D.
 *
 * Pour brancher l'animation Mixamo « bras croisés » quand elle arrivera :
 *   1. exporte-la depuis Mixamo en FBX « Without Skin », convertis-la en .glb
 *      (ou exporte directement un .glb) ;
 *   2. dépose le fichier dans `public/models/` ;
 *   3. renseigne son chemin dans `animationUrl` ci-dessous.
 * Elle remplace alors la pose procédurale ; la couche « vivant »
 * (respiration, regard, clignements) continue de s'ajouter par-dessus.
 */
export const avatarConfig = {
  modelUrl: '/models/avatar.glb',
  /** TODO : chemin de l'animation bras croisés (ex. '/models/arms-crossed.glb'), la pose prévue par le brief. */
  animationUrl: null as string | null,
}
