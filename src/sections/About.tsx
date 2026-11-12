import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lazy, Suspense, useRef, useState } from 'react'
import { GlowOrb } from '../components/GlowOrb'
import { Terminal } from '../components/Terminal'
import { about } from '../content/about'
import type { Theme } from '../hooks/useTheme'
import { sectionEntrance } from '../motion'

const DeskScene = lazy(() => import('../three/DeskScene'))

/** Si la 3D est indisponible, le terminal s'affiche en texte à la place du bureau. */
const deskFallback = (
  <div aria-hidden="true" className="hidden h-full items-center md:flex">
    <Terminal className="w-full" />
  </div>
)

export function About({ theme }: { theme: Theme }) {
  const root = useRef<HTMLElement>(null)
  const [deskStarted, setDeskStarted] = useState(false)

  // Le texte se pose comme une fiche qu'on remplit ; le bureau, lui, a sa propre chorégraphie.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 55%',
        once: true,
        onEnter: () => setDeskStarted(true),
      })
      sectionEntrance(root.current, (timeline) =>
        timeline
          .from('[data-entrance="title"]', { yPercent: 105, duration: 0.9 })
          .from('[data-entrance="paragraph"]', { autoAlpha: 0, x: -14, duration: 0.7, stagger: 0.12 }, '-=0.5')
          .from('[data-entrance="facts"]', { scaleX: 0, transformOrigin: 'left', duration: 0.8 }, '-=0.4')
          .from('[data-entrance="fact"]', { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.06 }, '-=0.5'),
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="a-propos" className="relative overflow-hidden bg-bg-100 py-16 md:py-24">
      <div className="page-container grid items-center gap-y-8 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <div className="overflow-hidden pb-[0.1em]">
            <h2 data-entrance="title" className="text-display-lg">
              {about.title}
            </h2>
          </div>
          <div className="mt-6 space-y-3 text-body-lg text-ink-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} data-entrance="paragraph">
                {paragraph}
              </p>
            ))}
          </div>
          <div data-entrance="facts" className="mt-6 h-px bg-line" />
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
            {about.facts.map((fact) => (
              <div key={fact.label} data-entrance="fact">
                <dt className="text-label text-ink-faint">{fact.label}</dt>
                <dd className="mt-1 text-body text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-7">
          <div className="relative h-[320px] md:h-[500px]">
            <GlowOrb className="top-[6%] left-[14%] size-[76%]" />
            <Suspense>
              <DeskScene theme={theme} started={deskStarted} fallback={deskFallback} />
            </Suspense>
          </div>
          {/* Sur grand écran le terminal se lit sur le moniteur 3D ; ici, sa version texte. */}
          <Terminal className="mt-6 md:sr-only" />
        </div>
      </div>
    </section>
  )
}
