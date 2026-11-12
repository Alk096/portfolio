import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowDown, Download, Mail } from 'lucide-react'
import { lazy, Suspense, useRef } from 'react'
import { BrandIcon } from '../components/BrandIcon'
import { Button } from '../components/Button'
import { GlowOrb } from '../components/GlowOrb'
import { cv, heroActions, identity, socials } from '../content/site'
import { isTodo, showDrafts } from '../content/todo'
import type { Theme } from '../hooks/useTheme'
import { ease } from '../motion'

// La 3D est chargée à part : le texte du hero s'affiche sans l'attendre.
const AvatarScene = lazy(() => import('../three/AvatarScene'))

const cvUrl = Object.values(
  import.meta.glob<string>('../assets/cv/*.pdf', { eager: true, query: '?url', import: 'default' }),
)[0]

const heroSocials = socials.filter((social) => !isTodo(social.href))

export function Hero({ theme }: { theme: Theme }) {
  const root = useRef<HTMLElement>(null)

  // Entrée : le texte monte ligne par ligne, comme une sortie de terminal qui s'écrit.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: ease.out } })
          .from('[data-hero-line]', { yPercent: 110, duration: 1, stagger: 0.09, delay: 0.15 })
          .from('[data-hero-fade]', { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.08 }, '-=0.65')
          .from('[data-hero-orb]', { autoAlpha: 0, scale: 0.85, duration: 1.6, ease: 'power2.out' }, 0.2)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative overflow-hidden pt-28 md:pt-0">
      <div className="page-container grid items-center gap-y-4 md:min-h-svh md:grid-cols-12 md:gap-x-6">
        <div className="relative z-(--z-raised) md:col-span-6 md:py-24">
          <h1 className="text-display-xl">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line className="block">
                {identity.firstName}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-hero-line className="block">
                {identity.lastName}
              </span>
            </span>
          </h1>

          <p data-hero-fade className="mt-6 max-w-[46ch] text-body-lg text-ink-muted">
            {identity.tagline}
          </p>

          <div data-hero-fade className="mt-7 flex flex-wrap gap-3">
            <Button href={heroActions.primary.href}>
              {heroActions.primary.label}
              <ArrowDown size={18} strokeWidth={1.75} aria-hidden="true" />
            </Button>
            <Button href={heroActions.secondary.href} variant="neon">
              <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
              {heroActions.secondary.label}
            </Button>
            {cvUrl ? (
              <Button href={cvUrl} download={cv.fileName} variant="ghost">
                <Download size={18} strokeWidth={1.75} aria-hidden="true" />
                {cv.label}
              </Button>
            ) : (
              showDrafts && (
                <span className="inline-flex h-12 items-center rounded-pill border border-dashed border-line-strong px-5 text-code text-ink-muted">
                  TODO : déposer le CV dans src/assets/cv/
                </span>
              )
            )}
          </div>

          {heroSocials.length > 0 && (
            <ul data-hero-fade aria-label="Réseaux" className="mt-6 flex gap-2">
              {heroSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label} (nouvel onglet)`}
                    title={social.label}
                    className="grid size-11 place-items-center rounded-full border border-line text-ink-muted transition-colors duration-300 hover:border-line-strong hover:text-ink"
                  >
                    <BrandIcon brand={social.brand} />
                  </a>
                </li>
              ))}
            </ul>
          )}

          {identity.available && (
            <p data-hero-fade className="mt-4 flex items-center gap-2 text-label text-ink-muted">
              <span aria-hidden="true" className="size-2 rounded-full bg-mint" />
              {identity.availableLabel}
            </p>
          )}
        </div>

        <div className="relative h-[440px] md:col-span-6 md:h-svh md:max-h-[900px]">
          <div data-hero-orb className="absolute inset-0">
            <GlowOrb className="top-[8%] right-[2%] size-[78%]" />
          </div>
          <Suspense>
            <AvatarScene theme={theme} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
