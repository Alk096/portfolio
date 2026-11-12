import { Quaternion, Vector3, type Mesh, type Object3D } from 'three'
import { clamp, damp, fbm, rand } from '../noise'

/**
 * La couche « vivant ».
 *
 * Elle s'AJOUTE à la couche de base (pose procédurale ou animation Mixamo)
 * et ne dépend pas d'elle. Chaque mouvement est piloté par du bruit ou par
 * des intervalles aléatoires : rien ne boucle, donc rien ne paraît mécanique.
 *
 *  - respiration : colonne + épaules, rythme légèrement variable ;
 *  - transfert de poids : bassin et contre-rotation du buste, très lent ;
 *  - regard : les yeux partent d'abord (saccade), la tête suit avec retard ;
 *  - micro-saccades, clignements irréguliers (parfois doubles) ;
 *  - micro-expressions : sourire et sourcils qui dérivent doucement.
 */

export type PointerState = {
  /** Position du curseur relative à l'avatar, dans [-1, 1]. */
  x: number
  y: number
  /** Horodatage (s) du dernier mouvement du curseur. */
  lastMove: number
  /** Le curseur survole l'avatar. */
  hover: boolean
}

const ADDITIVE_BONES = [
  'Hips',
  'Spine',
  'Spine1',
  'Spine2',
  'Neck',
  'Head',
  'LeftShoulder',
  'RightShoulder',
] as const
const EYE_BONES = ['LeftEye', 'RightEye'] as const

type BoneName = (typeof ADDITIVE_BONES)[number] | (typeof EYE_BONES)[number]

const AX = new Vector3(1, 0, 0)
const AY = new Vector3(0, 1, 0)
const AZ = new Vector3(0, 0, 1)
const q = new Quaternion()

export class AvatarLife {
  private bones = new Map<BoneName, Object3D>()
  private base = new Map<BoneName, Quaternion>()
  private hipsX = 0
  private morphMeshes: Mesh[] = []

  private t = rand(0, 100)
  private breathPhase = 0

  // Regard (radians, dans le repère de l'avatar)
  private gazeYaw = 0
  private gazePitch = 0
  private eyeYaw = 0
  private eyePitch = 0
  private headYaw = 0
  private headPitch = 0
  private wanderYaw = 0
  private wanderPitch = 0
  private nextWander = 0
  private saccadeYaw = 0
  private saccadePitch = 0
  private nextSaccade = 0

  private nextBlink = rand(1, 3)
  private blinkT = -1
  private blinkQueue = 0

  private engage = 0
  /** Direction (lacet) de la caméra vue par l'avatar : son regard « neutre ». */
  private cameraYaw: number

  constructor(root: Object3D, cameraYaw = 0) {
    this.cameraYaw = cameraYaw
    for (const name of [...ADDITIVE_BONES, ...EYE_BONES]) {
      const bone = root.getObjectByName(name)
      if (!bone) continue
      this.bones.set(name, bone)
      this.base.set(name, bone.quaternion.clone())
    }
    this.hipsX = this.bones.get('Hips')?.position.x ?? 0
    root.traverse((o) => {
      const mesh = o as Mesh
      if (mesh.isMesh && mesh.morphTargetDictionary) this.morphMeshes.push(mesh)
    })
    this.gazeYaw = this.eyeYaw = this.headYaw = cameraYaw
  }

  /**
   * @param baseIsAnimated vrai si un AnimationMixer vient d'écrire la couche de base :
   *                       on ajoute alors par-dessus au lieu de repartir de la pose mémorisée.
   */
  update(dt: number, pointer: PointerState, now: number, reduced: boolean, baseIsAnimated: boolean) {
    this.t += dt
    const t = this.t

    if (!baseIsAnimated) {
      for (const name of ADDITIVE_BONES) this.reset(name)
    }
    for (const name of EYE_BONES) this.reset(name)

    // Respiration : rythme qui dérive, inspiration plus vive que l'expiration.
    const rate = 0.23 + 0.03 * fbm(t * 0.08, 1)
    this.breathPhase += dt * Math.PI * 2 * rate
    const breath = Math.sin(this.breathPhase) + 0.25 * Math.sin(2 * this.breathPhase + 0.6)
    this.rotate('Spine1', AX, -0.013 * breath)
    this.rotate('Spine2', AX, -0.011 * breath)
    this.rotate('Neck', AX, 0.012 * breath)
    this.rotateParentSpace('LeftShoulder', AZ, 0.014 * breath)
    this.rotateParentSpace('RightShoulder', AZ, -0.014 * breath)

    if (reduced) {
      // Mouvement réduit : on garde le souffle et le clignement, regard posé sur le visiteur.
      this.applyGaze(this.cameraYaw, 0, this.cameraYaw, 0, 0)
      this.updateBlink(dt)
      this.setMorph('mouthSmileLeft', 0.12)
      this.setMorph('mouthSmileRight', 0.12)
      return
    }

    // Transfert de poids : très lent, le buste compense le bassin.
    const sway = fbm(t * 0.09, 3)
    const drift = fbm(t * 0.06, 7)
    const hips = this.bones.get('Hips')
    if (hips && !baseIsAnimated) hips.position.x = this.hipsX + 0.012 * sway
    this.rotate('Hips', AZ, 0.018 * sway)
    this.rotate('Spine', AZ, -0.024 * sway)
    this.rotate('Spine', AY, 0.03 * drift)

    // Cible du regard : le curseur s'il bouge, sinon une dérive calme.
    const pointerActive = now - pointer.lastMove < 4
    if (pointerActive) {
      this.setGazeTarget(
        this.cameraYaw + clamp(pointer.x, -1, 1) * 0.42,
        clamp(pointer.y, -1, 1) * 0.2,
      )
    } else {
      if (t > this.nextWander) {
        this.nextWander = t + rand(2.5, 6)
        const atViewer = Math.random() < 0.6
        this.wanderYaw = this.cameraYaw + (atViewer ? rand(-0.04, 0.04) : rand(-0.3, 0.3))
        this.wanderPitch = atViewer ? rand(-0.02, 0.03) : rand(-0.1, 0.08)
      }
      this.setGazeTarget(this.wanderYaw, this.wanderPitch)
    }

    // Micro-saccades : petits sauts instantanés, à intervalles irréguliers.
    if (t > this.nextSaccade) {
      this.nextSaccade = t + rand(0.6, 1.9)
      this.saccadeYaw = rand(-0.018, 0.018)
      this.saccadePitch = rand(-0.01, 0.01)
    }

    // Les yeux arrivent vite, la tête suit avec retard et ne fait qu'une partie du chemin.
    this.eyeYaw = damp(this.eyeYaw, this.gazeYaw, 16, dt)
    this.eyePitch = damp(this.eyePitch, this.gazePitch, 16, dt)
    this.headYaw = damp(this.headYaw, this.gazeYaw * 0.62, 2.2, dt)
    this.headPitch = damp(this.headPitch, this.gazePitch * 0.55, 2.2, dt)
    this.applyGaze(
      this.headYaw + 0.012 * fbm(t * 0.21, 13),
      this.headPitch + 0.01 * fbm(t * 0.17, 17),
      this.eyeYaw + this.saccadeYaw,
      this.eyePitch + this.saccadePitch,
      -0.12 * (this.headYaw - this.cameraYaw * 0.62) + 0.012 * fbm(t * 0.11, 19),
    )

    this.updateBlink(dt)

    // Micro-expressions : un sourire qui dérive, un peu plus franc quand on le survole.
    this.engage = damp(this.engage, pointer.hover ? 1 : 0, 2.5, dt)
    const smile = clamp(0.12 + 0.08 * fbm(t * 0.07, 21) + 0.2 * this.engage, 0, 1)
    const asym = 0.03 * fbm(t * 0.05, 23)
    this.setMorph('mouthSmileLeft', smile + asym)
    this.setMorph('mouthSmileRight', smile - asym)
    this.setMorph('cheekSquintLeft', smile * 0.4)
    this.setMorph('cheekSquintRight', smile * 0.4)
    const brow = Math.max(0, fbm(t * 0.05, 33)) * 0.16 + 0.12 * this.engage
    this.setMorph('browInnerUp', brow)
    this.setMorph('browOuterUpLeft', brow * 0.5)
    this.setMorph('browOuterUpRight', brow * 0.5)
  }

  private setGazeTarget(yaw: number, pitch: number) {
    // Un grand changement de regard s'accompagne naturellement d'un clignement.
    if (Math.abs(yaw - this.gazeYaw) > 0.22 && this.blinkT < 0 && Math.random() < 0.5) {
      this.blinkT = 0
    }
    this.gazeYaw = yaw
    this.gazePitch = pitch
  }

  /** pitch > 0 = vers le haut. */
  private applyGaze(headYaw: number, headPitch: number, eyeYaw: number, eyePitch: number, roll: number) {
    this.rotate('Spine2', AY, headYaw * 0.14)
    this.rotate('Neck', AY, headYaw * 0.3)
    this.rotate('Neck', AX, -headPitch * 0.35)
    this.rotate('Head', AY, headYaw * 0.56)
    this.rotate('Head', AX, -headPitch * 0.65)
    this.rotate('Head', AZ, roll)

    // Les yeux font le reste du chemin jusqu'à la cible.
    const ey = clamp(eyeYaw - headYaw, -0.5, 0.5)
    const ep = clamp(eyePitch - headPitch, -0.3, 0.3)
    for (const name of EYE_BONES) {
      this.rotate(name, AY, ey)
      this.rotate(name, AX, -ep)
    }
    // Les paupières accompagnent le regard vertical.
    const up = clamp(ep * 2, 0, 1)
    const down = clamp(-ep * 2, 0, 1)
    this.setMorph('eyeLookUpLeft', up)
    this.setMorph('eyeLookUpRight', up)
    this.setMorph('eyeLookDownLeft', down)
    this.setMorph('eyeLookDownRight', down)
  }

  private updateBlink(dt: number) {
    if (this.blinkT < 0 && this.t > this.nextBlink) this.blinkT = 0
    let v = 0
    if (this.blinkT >= 0) {
      this.blinkT += dt
      const close = 0.07
      const hold = 0.035
      const open = 0.15
      const bt = this.blinkT
      if (bt < close) v = bt / close
      else if (bt < close + hold) v = 1
      else if (bt < close + hold + open) v = 1 - (bt - close - hold) / open
      else {
        this.blinkT = -1
        if (this.blinkQueue > 0) {
          this.blinkQueue--
          this.nextBlink = this.t + 0.12
        } else {
          this.nextBlink = this.t + rand(2.2, 6.5)
          if (Math.random() < 0.14) this.blinkQueue = 1
        }
      }
      v = v * v * (3 - 2 * v)
    }
    this.setMorph('eyeBlinkLeft', v)
    this.setMorph('eyeBlinkRight', v)
  }

  private reset(name: BoneName) {
    const bone = this.bones.get(name)
    const base = this.base.get(name)
    if (bone && base) bone.quaternion.copy(base)
  }

  private rotate(name: BoneName, axis: Vector3, angle: number) {
    this.bones.get(name)?.quaternion.multiply(q.setFromAxisAngle(axis, angle))
  }

  private rotateParentSpace(name: BoneName, axis: Vector3, angle: number) {
    this.bones.get(name)?.quaternion.premultiply(q.setFromAxisAngle(axis, angle))
  }

  private setMorph(name: string, value: number) {
    for (const mesh of this.morphMeshes) {
      const index = mesh.morphTargetDictionary![name]
      if (index !== undefined) mesh.morphTargetInfluences![index] = value
    }
  }
}
