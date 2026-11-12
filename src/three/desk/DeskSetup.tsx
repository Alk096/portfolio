import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import {
  BoxGeometry,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type Object3D,
  type PointLight,
} from 'three'
import { terminal as terminalContent } from '../../content/about'
import { damp, fbm } from '../noise'
import { deskMaterials, light, tokens } from '../palette'
import { createTerminal } from './terminalTexture'

/**
 * Le setup PC, modélisé en primitives, et sa chorégraphie.
 *
 * Chaque objet tombe (accélération de type gravité), s'écrase à l'impact,
 * reprend sa forme en rebondissant, et fait tressaillir ceux déjà posés.
 * Ses arêtes s'allument un instant au choc : la lumière répond à l'impact.
 * Une fois tout en place, la caméra s'approche, l'écran s'allume et le
 * terminal se met à écrire.
 */

const DESK_TOP = 0.765
const AMBER = new Color(tokens.amber)
const VIOLET = new Color(tokens.violet)

const CAM_WIDE = new Vector3(-1.7, 1.9, 3.75)
const CAM_CLOSE = new Vector3(-0.5, 1.36, 2.5)
const LOOK_WIDE = new Vector3(0, 0.66, 0)
const LOOK_CLOSE = new Vector3(0.04, 1.04, -0.1)

type Props = {
  started: boolean
  reduced: boolean
  night: boolean
  pointer: RefObject<{ x: number; y: number }>
}

type BlockProps = {
  size: [number, number, number]
  position?: [number, number, number]
  color: string
  edge?: LineBasicMaterial
}

/** Une boîte mate, avec ses arêtes tracées d'un trait fin. */
function Block({ size, position, color, edge }: BlockProps) {
  const [w, h, d] = size
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(w, h, d)), [w, h, d])
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} />
      {edge && <lineSegments geometry={edges} material={edge} />}
    </mesh>
  )
}

export function DeskSetup({ started, reduced, night, pointer }: Props) {
  const materials = night ? deskMaterials.night : deskMaterials.day

  const desk = useRef<Group>(null!)
  const tower = useRef<Group>(null!)
  const monitor = useRef<Group>(null!)
  const keyboard = useRef<Group>(null!)
  const mouse = useRef<Group>(null!)
  const screen = useRef<Mesh>(null!)
  const screenMat = useRef<MeshBasicMaterial>(null!)
  const ledMat = useRef<MeshBasicMaterial>(null!)
  const glow = useRef<PointLight>(null!)

  // État de la séquence, lu à chaque image : caméra, voyant, texte tapé, curseur, parallaxe.
  const sequence = useRef({ cam: 0, led: 0, typed: 0, cursor: true, blinkAt: 0, px: 0, py: 0 })
  const look = useMemo(() => new Vector3(), [])

  const term = useMemo(() => createTerminal(terminalContent.title, terminalContent.lines), [])
  const edges = useMemo(
    () => ({
      desk: new LineBasicMaterial(),
      tower: new LineBasicMaterial(),
      monitor: new LineBasicMaterial(),
      keyboard: new LineBasicMaterial(),
    }),
    [],
  )

  // Au repos, les arêtes sont un simple trait discret, accordé au thème.
  useEffect(() => {
    for (const mat of Object.values(edges)) mat.color.set(materials.edge)
  }, [edges, materials.edge])

  // La police du terminal doit être chargée avant le premier dessin.
  useEffect(() => {
    let alive = true
    document.fonts.load('500 30px "JetBrains Mono Variable"').finally(() => {
      if (alive) term.draw(sequence.current.typed, sequence.current.cursor)
    })
    return () => {
      alive = false
    }
  }, [term])

  useEffect(() => {
    if (!started) return
    const seq = sequence.current
    // Couleur de repos des arêtes, déjà accordée au thème par l'effet précédent.
    const rest = edges.desk.color.clone()
    const parts: Object3D[] = [desk.current, tower.current, monitor.current, keyboard.current, mouse.current]

    const ctx = gsap.context(() => {
      if (reduced) {
        // Mouvement réduit : tout est déjà en place, écran allumé, texte complet.
        parts.forEach((part) => (part.visible = true))
        seq.cam = 1
        seq.led = 1
        seq.typed = term.total
        screenMat.current.color.setScalar(1)
        glow.current.intensity = 1.1
        term.draw(seq.typed, true)
        return
      }

      const timeline = gsap.timeline()
      const placed: Object3D[] = []
      // Hauteurs de repos, relevées avant que les tweens ne déplacent quoi que ce soit.
      const restY = new Map(parts.map((part) => [part, part.position.y]))

      const drop = (
        obj: Object3D,
        at: number,
        opts: { height?: number; dur?: number; squash?: number; rebound?: number; shake?: number },
        edge?: LineBasicMaterial,
        accent?: Color,
      ) => {
        const { height = 2.6, dur = 0.5, squash = 0.08, rebound = 0.02, shake = 0.012 } = opts
        const y = restY.get(obj)!
        const hit = at + dur
        timeline.set(obj, { visible: true }, at)
        timeline.fromTo(obj.position, { y: y + height }, { y, duration: dur, ease: 'power2.in' }, at)
        // Écrasement à l'impact, puis retour élastique à la forme d'origine.
        timeline.to(
          obj.scale,
          { y: 1 - squash, x: 1 + squash * 0.5, z: 1 + squash * 0.5, duration: 0.07, ease: 'power1.out' },
          hit,
        )
        timeline.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1.1, 0.42)' }, hit + 0.07)
        if (rebound > 0) {
          timeline.to(obj.position, { y: y + rebound, duration: 0.11, ease: 'power1.out' }, hit + 0.05)
          timeline.to(obj.position, { y, duration: 0.34, ease: 'bounce.out' }, hit + 0.16)
        }
        // Les objets déjà posés encaissent le choc.
        for (const other of placed) {
          const oy = restY.get(other)!
          timeline.to(other.position, { y: oy + shake, duration: 0.08, ease: 'power1.out' }, hit)
          timeline.to(other.position, { y: oy, duration: 0.3, ease: 'bounce.out' }, hit + 0.08)
        }
        // Les arêtes s'allument au choc, puis s'éteignent doucement.
        if (edge && accent) {
          timeline.to(edge.color, { r: accent.r, g: accent.g, b: accent.b, duration: 0.05 }, hit)
          timeline.to(edge.color, { r: rest.r, g: rest.g, b: rest.b, duration: 1.3, ease: 'power2.out' }, hit + 0.12)
        }
        placed.push(obj)
      }

      drop(desk.current, 0, { height: 3, dur: 0.55, squash: 0.06, rebound: 0 }, edges.desk, AMBER)
      drop(tower.current, 0.8, { dur: 0.5, squash: 0.07, rebound: 0.012, shake: 0.016 }, edges.tower, VIOLET)
      drop(monitor.current, 1.5, { dur: 0.5, squash: 0.05, rebound: 0.014 }, edges.monitor, AMBER)
      // Le moniteur oscille sur son pied avant de se stabiliser.
      timeline.fromTo(
        monitor.current.rotation,
        { z: 0.07 },
        { z: 0, duration: 1.1, ease: 'elastic.out(1, 0.28)' },
        2.0,
      )
      // Le clavier arrive de travers et se remet d'aplomb en touchant le bureau.
      timeline.fromTo(
        keyboard.current.rotation,
        { y: 0.7, z: 0.25 },
        { y: 0.06, z: 0, duration: 0.5, ease: 'power2.in' },
        2.25,
      )
      drop(keyboard.current, 2.25, { height: 1.8, dur: 0.44, squash: 0.2, rebound: 0.03, shake: 0.006 }, edges.keyboard, VIOLET)
      // La souris, légère, rebondit franchement.
      drop(mouse.current, 2.8, { height: 1.6, dur: 0.4, squash: 0.22, rebound: 0.07, shake: 0.003 })

      // Tout est posé : la caméra s'approche, la tour puis l'écran s'allument.
      timeline.to(seq, { cam: 1, duration: 1.9, ease: 'power2.inOut' }, 3.5)
      timeline.to(seq, { led: 1, duration: 0.6, ease: 'power2.out' }, 3.7)
      timeline.fromTo(screen.current.scale, { y: 0.02 }, { y: 1, duration: 0.32, ease: 'power3.out' }, 4.3)
      timeline.to(screenMat.current.color, { r: 1, g: 1, b: 1, duration: 0.5, ease: 'power2.out' }, 4.3)
      timeline.to(glow.current, { intensity: 1.1, duration: 0.7, ease: 'power2.out' }, 4.3)
      timeline.to(seq,
        {
          typed: term.total,
          duration: term.total * 0.045,
          ease: 'none',
          onUpdate: () => term.draw(seq.typed, true),
        },
        4.9,
      )
    })
    return () => ctx.revert()
  }, [started, reduced, term, edges])

  useFrame((state, delta) => {
    const seq = sequence.current
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    // Caméra : du plan large au plan rapproché, avec une légère parallaxe au curseur.
    seq.px = damp(seq.px, reduced ? 0 : pointer.current.x, 2.5, dt)
    seq.py = damp(seq.py, reduced ? 0 : pointer.current.y, 2.5, dt)
    state.camera.position.lerpVectors(CAM_WIDE, CAM_CLOSE, seq.cam)
    state.camera.position.x += seq.px * 0.16
    state.camera.position.y += seq.py * 0.08
    look.lerpVectors(LOOK_WIDE, LOOK_CLOSE, seq.cam)
    state.camera.lookAt(look)

    // Le voyant de la tour « respire » sans jamais boucler.
    ledMat.current.color.copy(VIOLET).multiplyScalar(seq.led * (0.8 + 0.2 * fbm(t * 0.5, 5)))

    // Curseur du terminal : seul élément du site autorisé à clignoter.
    if (!reduced && seq.typed >= term.total && t > seq.blinkAt) {
      seq.blinkAt = t + 0.53
      seq.cursor = !seq.cursor
      term.draw(seq.typed, seq.cursor)
    }
  })

  return (
    <>
      <hemisphereLight args={[light.sky, light.ground, night ? 1.2 : 2.2]} />
      <directionalLight position={[-2, 3.2, 2.4]} color={light.key} intensity={night ? 2.2 : 2.6} />
      <directionalLight position={[2.6, 1.6, -2]} color={tokens.violet} intensity={night ? 2.4 : 0.6} />

      <group ref={desk} visible={false}>
        <Block size={[1.6, 0.05, 0.74]} position={[0, 0.74, 0]} color={materials.desk} edge={edges.desk} />
        <Block size={[0.05, 0.715, 0.66]} position={[-0.72, 0.3575, 0]} color={materials.body} edge={edges.desk} />
        <Block size={[0.05, 0.715, 0.66]} position={[0.72, 0.3575, 0]} color={materials.body} edge={edges.desk} />
        <Block size={[1.39, 0.28, 0.03]} position={[0, 0.56, -0.3]} color={materials.body} />
      </group>

      <group ref={tower} position={[0.54, DESK_TOP, -0.06]} visible={false}>
        <Block size={[0.2, 0.44, 0.44]} position={[0, 0.22, 0]} color={materials.body} edge={edges.tower} />
        <Block size={[0.15, 0.3, 0.004]} position={[0, 0.25, 0.222]} color={materials.bodyHi} />
        <mesh position={[-0.085, 0.22, 0.2215]}>
          <boxGeometry args={[0.008, 0.36, 0.006]} />
          <meshBasicMaterial ref={ledMat} color={tokens.bg000} toneMapped={false} />
        </mesh>
      </group>

      <group ref={monitor} position={[-0.12, DESK_TOP, -0.16]} visible={false}>
        <Block size={[0.3, 0.014, 0.2]} position={[0, 0.007, 0]} color={materials.bodyHi} />
        <Block size={[0.045, 0.2, 0.03]} position={[0, 0.11, -0.03]} color={materials.body} />
        <Block size={[0.86, 0.5, 0.03]} position={[0, 0.44, 0]} color={materials.body} edge={edges.monitor} />
        <mesh ref={screen} position={[0, 0.44, 0.0156]}>
          <planeGeometry args={[0.82, 0.46]} />
          <meshBasicMaterial ref={screenMat} map={term.texture} color={tokens.bg000} toneMapped={false} />
        </mesh>
        {/* La lumière de l'écran sur le bureau et le clavier. */}
        <pointLight ref={glow} position={[0, 0.4, 0.35]} color={light.screen} intensity={0} distance={1.6} />
      </group>

      <group ref={keyboard} position={[-0.14, DESK_TOP, 0.2]} rotation-y={0.06} visible={false}>
        <Block size={[0.46, 0.018, 0.15]} position={[0, 0.009, 0]} color={materials.bodyHi} edge={edges.keyboard} />
        {[-0.048, -0.016, 0.016, 0.048].map((z) => (
          <Block key={z} size={[0.42, 0.008, 0.024]} position={[0, 0.022, z]} color={materials.keys} />
        ))}
      </group>

      <group ref={mouse} position={[0.24, DESK_TOP, 0.22]} visible={false}>
        <mesh position={[0, 0.016, 0]} scale={[0.034, 0.018, 0.056]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshStandardMaterial color={materials.bodyHi} roughness={0.7} />
        </mesh>
      </group>
    </>
  )
}
