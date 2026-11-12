import { useEffect, useRef, type ReactNode } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { Theme } from '../hooks/useTheme'
import { DeskSetup } from './desk/DeskSetup'
import { SceneCanvas } from './SceneCanvas'

type Props = { theme: Theme; started: boolean; fallback: ReactNode }

export default function DeskScene({ theme, started, fallback }: Props) {
  const pointer = useRef({ x: 0, y: 0 })
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <SceneCanvas
      // La position de la caméra est pilotée image par image par la séquence du bureau.
      camera={{ fov: 30, near: 0.1, far: 30 }}
      fallback={fallback}
      className={`transition-opacity duration-300 ${started ? 'opacity-100' : 'opacity-0'}`}
      style={{
        // Les bords du canvas se fondent dans la section : aucun objet n'est coupé net.
        maskImage: 'radial-gradient(ellipse 56% 56% at 50% 50%, #000 84%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 56% 56% at 50% 50%, #000 84%, transparent 100%)',
      }}
    >
      <DeskSetup started={started} reduced={reducedMotion} night={theme === 'dark'} pointer={pointer} />
    </SceneCanvas>
  )
}
