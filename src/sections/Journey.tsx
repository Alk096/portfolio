import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { Card } from '../components/Card'
import { Copy } from '../components/Copy'
import { SectionHeader } from '../components/SectionHeader'
import { journey, journeyIntro } from '../content/journey'
import { ease, sectionEntrance } from '../motion'

/** Point de la fenêtre où la ligne « arrive » : un nœud s'allume quand il le franchit. */
const READING_LINE = 'top 62%'

export function Journey() {
  const root = useRef<HTMLElement>(null)

  // La ligne se trace au fil du scroll ; chaque nœud s'allume quand elle l'atteint,
  // et sa carte arrive de son côté de la timeline.
  useGSAP(
    () => {
      sectionEntrance(root.current, (timeline) =>
        timeline
          .from('[data-entrance="title"]', { yPercent: 105, duration: 0.9 }),
      )
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-line]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-timeline]', start: READING_LINE, end: 'bottom 62%', scrub: 0.6 },
          },
        )
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
          const node = step.querySelector('[data-node]')!
          const card = step.querySelector('[data-step-card]')!
          const fromLeft = step.dataset.step === 'left'
          gsap.from(card, {
            autoAlpha: 0,
            x: fromLeft ? -40 : 40,
            duration: 0.9,
            ease: ease.out,
            scrollTrigger: { trigger: step, start: 'top 85%', once: true },
          })
          ScrollTrigger.create({
            trigger: step,
            start: READING_LINE,
            onEnter: () => node.setAttribute('data-active', ''),
            onLeaveBack: () => node.removeAttribute('data-active'),
          })
        })
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray<HTMLElement>('[data-node]').forEach((node) => node.setAttribute('data-active', ''))
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="parcours" className="bg-bg-000 py-16 md:py-32">
      <div className="page-container">
        <SectionHeader {...journeyIntro} />

        <div data-timeline className="relative mt-12 md:mt-24">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-1/2" />
          <div
            data-line
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[6px] w-[3px] origin-top rounded-full md:left-[calc(50%-1px)]"
            style={{ background: 'var(--gradient-neon-vertical)' }}
          />

          <ol className="space-y-10 md:space-y-16">
            {journey.map((step, i) => {
              const left = i % 2 === 0
              return (
                <li
                  key={step.period}
                  data-step={left ? 'left' : 'right'}
                  className="relative grid md:grid-cols-2 md:gap-x-24"
                >
                  <span
                    data-node
                    aria-hidden="true"
                    className="absolute top-7 left-0 size-[15px] rounded-full border-2 border-line-strong bg-bg-000 transition-[background-color,border-color,box-shadow] duration-500 data-active:border-violet data-active:bg-violet data-active:shadow-glow-violet md:left-[calc(50%-7px)]"
                  />
                  <div data-step-card className={`pl-10 md:pl-0 ${left ? '' : 'md:col-start-2'}`}>
                    <Card innerClassName="p-6">
                      <p className="text-label text-violet-text tabular-nums">{step.period}</p>
                      <h3 className="mt-3 text-h3">
                        <Copy>{step.title}</Copy>
                      </h3>
                      <p className="mt-3 text-body-sm text-ink-muted">
                        <Copy>{step.text}</Copy>
                      </p>
                    </Card>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
