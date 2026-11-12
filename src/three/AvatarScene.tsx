import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { Theme } from '../hooks/useTheme'
import { Avatar } from './avatar/Avatar'
import type { PointerState } from './avatar/life'
import { light, tokens } from './palette'
import { SceneCanvas } from './SceneCanvas'

const CAMERA = { fov: 26, position: [0, 1.42, 2.55] as const, near: 0.1, far: 20 }
const LOOK_AT = [0, 1.36, 0] as const
/** Hauteur du regard dans le cadre, pour orienter les yeux vers le curseur. */
const EYE_LINE = 0.3

export default function AvatarScene({ theme }: { theme: Theme }) {
  const area = useRef<HTMLDivElement>(null)
  const pointer = useRef<PointerState>({ x: 0, y: 0, lastMove: -100, hover: false })
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [ready, setReady] = useState(false)

  // Suivi sur toute la fenêtre : l'avatar remarque le visiteur où qu'il soit.
  useEffect(() => {
    const start = performance.now()
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !area.current) return
      const rect = area.current.getBoundingClientRect()
      const p = pointer.current
      p.x = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2)
      p.y = -(event.clientY - (rect.top + rect.height * EYE_LINE)) / (window.innerHeight / 2)
      p.lastMove = (performance.now() - start) / 1000
      p.hover =
        event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const night = theme === 'dark'

  return (
    <div ref={area} className="h-full w-full">
      <SceneCanvas
        camera={CAMERA}
        onCreated={({ camera }) => camera.lookAt(...LOOK_AT)}
        className={`transition-opacity duration-1000 ease-out-soft ${ready ? 'opacity-100' : 'opacity-0'}`}
        style={{
          maskImage: 'linear-gradient(to bottom, #000 72%, transparent 98%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent 98%)',
        }}
      >
        <hemisphereLight args={[light.sky, light.ground, night ? 1.1 : 1.9]} />
        <directionalLight position={[-1.6, 2.4, 2.6]} color={light.key} intensity={night ? 2.4 : 2.8} />
        {/* Contre-jours néon : ambre côté texte, violet de l'autre. */}
        <directionalLight position={[-2.4, 1.8, -2]} color={tokens.amber} intensity={night ? 3.2 : 1.2} />
        <directionalLight position={[2.4, 2, -2.2]} color={tokens.violet} intensity={night ? 4 : 1.4} />
        <Avatar pointer={pointer} reducedMotion={reducedMotion} onReady={() => setReady(true)} />
      </SceneCanvas>
    </div>
  )
}
