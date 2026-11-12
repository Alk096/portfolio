import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { ease } from '../motion'

const EXIT_DURATION = 0.16
const EXIT_STAGGER = 0.025

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Transition entre deux panneaux d'onglets.
 *
 * `active` est l'onglet choisi (le bouton s'allume tout de suite) ; la valeur
 * renvoyée est le panneau réellement affiché. Entre les deux, les éléments
 * `data-tab-item` du panneau sortant s'effacent, puis ceux du panneau entrant
 * montent l'un après l'autre. Un nouveau clic pendant la sortie l'interrompt.
 */
export function useTabSwap<T extends string>(scope: RefObject<HTMLElement | null>, active: T) {
  const [shown, setShown] = useState(active)
  // Lus par les animations : toujours à jour, contrairement à l'état capturé par une closure.
  const shownNow = useRef(active)
  const lastEntered = useRef(active)

  const panelItems = (id: string) =>
    gsap.utils.toArray<HTMLElement>(`[data-panel="${id}"] [data-tab-item]`, scope.current)

  useEffect(() => {
    if (active === shownNow.current) return
    const show = () => {
      shownNow.current = active
      setShown(active)
    }
    if (reducedMotion()) {
      show()
      return
    }
    const leaving = panelItems(shownNow.current)
    const exit = gsap.to(leaving, {
      autoAlpha: 0,
      y: -10,
      duration: EXIT_DURATION,
      ease: ease.in,
      stagger: EXIT_STAGGER,
      overwrite: true,
    })
    // Le changement de panneau suit une horloge à part : si une autre animation reprend
    // la main sur les éléments sortants, l'onglet choisi s'affiche quand même.
    const swap = gsap.delayedCall(EXIT_DURATION + EXIT_STAGGER * Math.max(0, leaving.length - 1), show)
    return () => {
      exit.kill()
      swap.kill()
    }
    // panelItems ne dépend que de la ref `scope`, stable.
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (shown === lastEntered.current) return
    lastEntered.current = shown
    if (reducedMotion()) return
    gsap.fromTo(
      panelItems(shown),
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: ease.out,
        stagger: 0.06,
        overwrite: true,
        clearProps: 'opacity,visibility,transform',
      },
    )
  }, [shown]) // eslint-disable-line react-hooks/exhaustive-deps

  return shown
}
