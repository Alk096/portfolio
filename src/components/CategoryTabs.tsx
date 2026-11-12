import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { categories, type CategoryId } from '../content/categories'
import { useMediaQuery } from '../hooks/useMediaQuery'

type Props = {
  /** Préfixe des identifiants, unique par section (« skills », « projets »). */
  name: string
  /** Nom lu par les lecteurs d'écran pour le groupe d'onglets. */
  label: string
  /** Côté des boutons sur grand écran. Sur mobile, ils passent toujours au-dessus. */
  side: 'left' | 'right'
  active: CategoryId
  onChange: (id: CategoryId) => void
  /** Panneau réellement affiché (voir `useTabSwap`). */
  shown: CategoryId
  renderPanel: (id: CategoryId) => ReactNode
}

type Indicator = { x: number; y: number; w: number; h: number }

/**
 * Onglets de catégories, communs à Skills et Projets.
 *
 * Grand écran : un rail unique, libellés écrits à la verticale en lettres
 * droites (CSS `writing-mode` + `text-orientation: upright` : le mot reste un
 * mot pour les lecteurs d'écran). Un indicateur glisse jusqu'à l'onglet actif,
 * comme un contrôle segmenté : l'onglet actif suffit à rappeler la catégorie
 * affichée.
 * Mobile : le même rail, à l'horizontale et défilable.
 *
 * Tous les panneaux occupent la même case de grille ; seul le panneau affiché
 * est visible. La zone garde donc la hauteur du plus grand : aucun saut de
 * mise en page au changement de catégorie.
 */
export function CategoryTabs({ name, label, side, active, onChange, shown, renderPanel }: Props) {
  const list = useRef<HTMLDivElement>(null)
  const vertical = useMediaQuery('(min-width: 768px)')
  const [indicator, setIndicator] = useState<Indicator | null>(null)

  // L'indicateur suit l'onglet actif, et se recale si la mise en page change (polices, redimensionnement).
  useLayoutEffect(() => {
    const rail = list.current
    if (!rail) return
    const measure = () => {
      const tab = rail.querySelector<HTMLElement>(`#${name}-tab-${active}`)
      if (tab) setIndicator({ x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    return () => ro.disconnect()
  }, [active, name, vertical])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = categories.findIndex((c) => c.id === active)
    const last = categories.length - 1
    let next = -1
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next < 0) return
    event.preventDefault()
    const id = categories[next].id
    onChange(id)
    const tab = list.current?.querySelector<HTMLElement>(`#${name}-tab-${id}`)
    tab?.focus()
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <div className={`flex flex-col gap-4 md:gap-5 ${side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
      {/* Sur mobile, le rail défile seul : il déborde dans la gouttière pour ne pas couper le dernier onglet. */}
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
        <div
          ref={list}
          role="tablist"
          aria-label={label}
          aria-orientation={vertical ? 'vertical' : 'horizontal'}
          onKeyDown={onKeyDown}
          className="relative inline-flex gap-1 rounded-pill border border-line bg-bg-200 p-1 md:sticky md:top-28 md:flex-col"
        >
          {indicator && (
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 rounded-pill border border-amber-text bg-bg-300 shadow-[0_0_14px_var(--halo-amber)] transition-[translate,width,height] duration-500 ease-out-soft motion-reduce:transition-none"
              style={{
                translate: `${indicator.x}px ${indicator.y}px`,
                width: indicator.w,
                height: indicator.h,
              }}
            />
          )}

          {categories.map((category) => {
            const selected = category.id === active
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`${name}-tab-${category.id}`}
                aria-selected={selected}
                aria-controls={`${name}-panel-${category.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange(category.id)}
                className={
                  'relative shrink-0 rounded-pill px-4 py-2 text-label ' +
                  'transition-colors duration-300 ' +
                  // En écriture verticale, Tailwind v4 écrit px/py en propriétés logiques :
                  // px (inline) règle alors le haut et le bas, py (block) la largeur.
                  'md:w-10 md:px-4 md:py-0 md:[text-orientation:upright] md:[writing-mode:vertical-rl] ' +
                  (selected ? 'text-amber-text' : 'text-ink-muted hover:bg-bg-300/60 hover:text-ink')
                }
              >
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid min-w-0 flex-1">
        {categories.map((category) => {
          const visible = category.id === shown
          return (
            <div
              key={category.id}
              role="tabpanel"
              id={`${name}-panel-${category.id}`}
              aria-labelledby={`${name}-tab-${category.id}`}
              data-panel={category.id}
              tabIndex={visible ? 0 : -1}
              className={`col-start-1 row-start-1 rounded-lg ${visible ? '' : 'invisible'}`}
            >
              {renderPanel(category.id)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
