import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { AnimationMixer, type Mesh } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { avatarConfig } from '../../content/avatar'
import { AvatarLife, type PointerState } from './life'
import { applyRestPose } from './pose'

/** Corps tourné de trois quarts vers le texte ; la tête, elle, revient vers le visiteur. */
const BODY_YAW = -0.38

type Props = {
  pointer: RefObject<PointerState>
  reducedMotion: boolean
  onReady?: () => void
}

export function Avatar({ pointer, reducedMotion, onReady }: Props) {
  const { scene } = useGLTF(avatarConfig.modelUrl, false, true)
  const mixer = useRef<AnimationMixer | null>(null)

  const life = useMemo(() => {
    scene.traverse((o) => {
      // Un maillage skinné déformé sort de sa boîte englobante d'origine.
      if ((o as Mesh).isMesh) o.frustumCulled = false
    })
    applyRestPose(scene)
    return new AvatarLife(scene, -BODY_YAW)
  }, [scene])

  useEffect(() => {
    onReady?.()
  }, [onReady])

  // Couche de base optionnelle : l'animation Mixamo, dès qu'elle est renseignée.
  useEffect(() => {
    const url = avatarConfig.animationUrl
    if (!url) return
    let cancelled = false
    new GLTFLoader()
      .loadAsync(url)
      .then((gltf) => {
        const clip = gltf.animations[0]
        if (cancelled || !clip) return
        // Mixamo préfixe les os (« mixamorigHips ») et exporte en centimètres :
        // on aligne les noms et on ne garde que les rotations.
        clip.tracks = clip.tracks.filter((track) => !track.name.endsWith('.position'))
        for (const track of clip.tracks) track.name = track.name.replace(/^mixamorig:?/, '')
        const animationMixer = new AnimationMixer(scene)
        animationMixer.clipAction(clip).play()
        mixer.current = animationMixer
      })
      // Fichier absent ou illisible : la pose procédurale reste en place, rien d'autre à faire.
      .catch(() => {})
    return () => {
      cancelled = true
      mixer.current?.stopAllAction()
      mixer.current = null
    }
  }, [scene])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    mixer.current?.update(dt)
    life.update(dt, pointer.current, state.clock.elapsedTime, reducedMotion, mixer.current !== null)
  })

  return <primitive object={scene} rotation-y={BODY_YAW} />
}

useGLTF.preload(avatarConfig.modelUrl, false, true)
