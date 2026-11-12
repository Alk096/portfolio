import { useId, type Ref } from 'react'

type Props = {
  name: string
  ring: string
  caption: string
  /** Allumé : certification obtenue. Éteint : contour discret, rien ne brille. */
  lit: boolean
  ref?: Ref<HTMLDivElement>
}

const RING_RADIUS = 45
const RING_LENGTH = Math.round(2 * Math.PI * RING_RADIUS) - 2

/**
 * Sceau circulaire de la carte de certification. Le texte suit le cercle extérieur ;
 * au centre, le nom et l'état. L'attribut `data-lit` porte l'état visuel, pour que
 * l'animation du tampon puisse l'allumer au moment de l'impact.
 */
export function Seal({ name, ring, caption, lit, ref }: Props) {
  const pathId = useId()
  return (
    <div
      ref={ref}
      data-lit={lit ? '' : undefined}
      aria-hidden="true"
      className="group size-24 shrink-0 text-ink-faint transition-[color,filter] duration-300 data-lit:text-amber-text data-lit:drop-shadow-[0_0_14px_var(--halo-amber)] md:size-28"
    >
      <svg viewBox="0 0 120 120" className="size-full">
        <defs>
          <path
            id={pathId}
            d={`M60 ${60 - RING_RADIUS} a${RING_RADIUS} ${RING_RADIUS} 0 1 1 -0.01 0`}
          />
        </defs>
        <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="52.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <text
          className="fill-current font-mono"
          fontSize="6.6"
          fontWeight="500"
          textLength={RING_LENGTH}
          lengthAdjust="spacing"
        >
          <textPath href={`#${pathId}`}>{ring}</textPath>
        </text>
        <circle
          cx="60"
          cy="60"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2.5 3"
          className="group-data-lit:[stroke-dasharray:none]"
        />
        <text x="60" y="61" textAnchor="middle" className="fill-current font-display" fontSize="19" fontWeight="700">
          {name}
        </text>
        <text
          x="60"
          y="76"
          textAnchor="middle"
          className="fill-current font-mono uppercase"
          fontSize="7.4"
          letterSpacing="0.8"
        >
          {caption}
        </text>
      </svg>
    </div>
  )
}
