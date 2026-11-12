import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Les points de déclenchement sont calculés au chargement ; quand les polices arrivent,
// les textes changent de hauteur et décalent toute la page : on les recalcule.
document.fonts.ready.then(() => ScrollTrigger.refresh())

export const ease = {
  out: 'power3.out',
  in: 'power2.in',
} as const

/** Où se déclenche l'entrée d'une section : quand son haut atteint ce point de la fenêtre. */
const ENTRANCE_START = 'top 78%'

/**
 * Entrée d'une section : `build` reçoit une timeline en pause, jouée une seule fois
 * quand la section arrive à l'écran. Rien n'est joué si le visiteur a demandé
 * moins d'animations : les éléments restent simplement à leur place.
 * À appeler dans un `useGSAP` pour que tout soit nettoyé au démontage.
 */
export function sectionEntrance(trigger: Element | null, build: (timeline: gsap.core.Timeline) => void) {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const timeline = gsap.timeline({
      defaults: { ease: ease.out },
      scrollTrigger: { trigger, start: ENTRANCE_START, once: true },
    })
    build(timeline)
  })
}
