import { useEffect, useState, type RefObject } from 'react'

/**
 * Vrai tant que l'élément est visible ET que l'onglet est au premier plan.
 * Sert à mettre le rendu 3D en pause dès qu'il sort de l'écran.
 */
export function useOnScreen(ref: RefObject<Element | null>, margin = '100px') {
  const [inView, setInView] = useState(true)
  const [tabVisible, setTabVisible] = useState(!document.hidden)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: margin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])

  useEffect(() => {
    const onChange = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return inView && tabVisible
}
