import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, type CanvasProps } from '@react-three/fiber'
import { Component, Suspense, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useOnScreen } from '../hooks/useOnScreen'

const MAX_DPR = Math.min(1.5, window.devicePixelRatio || 1)
const MIN_DPR = 0.75

const webgl = (() => {
  const canvas = document.createElement('canvas')
  return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
})()

type BoundaryProps = { fallback: ReactNode; children: ReactNode }

/** Modèle introuvable, chunk 3D qui ne charge pas, contexte WebGL perdu : la page reste debout. */
class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

type Props = {
  camera: CanvasProps['camera']
  onCreated?: CanvasProps['onCreated']
  className?: string
  style?: CSSProperties
  /** Affiché à la place de la scène si WebGL manque ou si la scène échoue. */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Canvas 3D commun aux deux scènes du site. Il ne rend rien hors écran ni
 * onglet masqué, et baisse sa résolution si la machine décroche.
 */
export function SceneCanvas({ camera, onCreated, className, style, fallback = null, children }: Props) {
  const wrapper = useRef<HTMLDivElement>(null)
  const onScreen = useOnScreen(wrapper)
  const [dpr, setDpr] = useState(MAX_DPR)

  if (!webgl) return fallback

  return (
    <SceneBoundary fallback={fallback}>
      <div ref={wrapper} aria-hidden="true" className={`h-full w-full ${className ?? ''}`} style={style}>
        <Canvas
          dpr={dpr}
          frameloop={onScreen ? 'always' : 'never'}
          camera={camera}
          onCreated={onCreated}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <PerformanceMonitor
            onChange={({ factor }) => setDpr(Math.round((MIN_DPR + (MAX_DPR - MIN_DPR) * factor) * 10) / 10)}
          />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      </div>
    </SceneBoundary>
  )
}
