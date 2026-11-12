import { Quaternion, Vector3, type Object3D } from 'three'

/**
 * Pose de repos calculée en code (bras relâchés le long du corps),
 * en attendant l'animation Mixamo.
 *
 * Plutôt que des angles d'Euler devinés os par os, on donne à chaque segment
 * du bras la DIRECTION qu'il doit prendre (dans le repère de l'avatar :
 * +X = sa gauche, +Y = haut, +Z = devant lui) et on en déduit la rotation.
 * Changer la pose revient donc à modifier quelques vecteurs lisibles.
 */
type Segment = {
  bone: string
  /** Os enfant qui définit l'axe du segment. */
  child: string
  dir: [number, number, number]
  /** Torsion autour de l'axe du segment, en radians. */
  twist?: number
}

const SEGMENTS: Segment[] = [
  // Bras légèrement écartés du buste, coudes à peine fléchis, mains devant les cuisses.
  { bone: 'LeftArm', child: 'LeftForeArm', dir: [0.16, -0.98, 0.02] },
  { bone: 'LeftForeArm', child: 'LeftHand', dir: [0.06, -0.97, 0.22] },
  { bone: 'LeftHand', child: 'LeftHandMiddle1', dir: [-0.02, -0.96, 0.28] },
  { bone: 'RightArm', child: 'RightForeArm', dir: [-0.16, -0.98, 0.02] },
  { bone: 'RightForeArm', child: 'RightHand', dir: [-0.06, -0.97, 0.22] },
  { bone: 'RightHand', child: 'RightHandMiddle1', dir: [0.02, -0.96, 0.28] },
]

/** Légère flexion des doigts pour éviter les mains « en planche ». */
const FINGER_CURL = 0.22
const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky']

const qBone = new Quaternion()
const qParent = new Quaternion()
const qRoot = new Quaternion()
const qDelta = new Quaternion()
const axisLocal = new Vector3()
const axisWorld = new Vector3()
const target = new Vector3()
const X = new Vector3(1, 0, 0)

export function applyRestPose(root: Object3D) {
  root.updateWorldMatrix(true, true)
  root.getWorldQuaternion(qRoot)

  for (const seg of SEGMENTS) {
    const bone = root.getObjectByName(seg.bone)
    const child = root.getObjectByName(seg.child)
    if (!bone || !child || !bone.parent) continue

    bone.getWorldQuaternion(qBone)
    axisLocal.copy(child.position).normalize()
    axisWorld.copy(axisLocal).applyQuaternion(qBone)
    target.set(...seg.dir).normalize().applyQuaternion(qRoot)

    qDelta.setFromUnitVectors(axisWorld, target)
    qBone.premultiply(qDelta)
    bone.parent.getWorldQuaternion(qParent)
    bone.quaternion.copy(qParent.invert().multiply(qBone))
    if (seg.twist) {
      bone.quaternion.multiply(qDelta.setFromAxisAngle(axisLocal, seg.twist))
    }
    bone.updateWorldMatrix(false, true)
  }

  for (const side of ['Left', 'Right']) {
    for (const finger of FINGERS) {
      for (let i = 1; i <= 3; i++) {
        const joint = root.getObjectByName(`${side}Hand${finger}${i}`)
        joint?.quaternion.multiply(qDelta.setFromAxisAngle(X, FINGER_CURL))
      }
    }
  }
  root.updateWorldMatrix(true, true)
}
