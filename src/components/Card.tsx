import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** La carte mène quelque part : elle réagit au survol et au focus. Sinon elle reste immobile. */
  interactive?: boolean
  className?: string
  innerClassName?: string
}

/**
 * Carte à bordure fine. Une carte interactive passe au dégradé néon et se soulève
 * au survol ou quand le lien qu'elle contient a le focus.
 */
export function Card({ children, interactive = false, className = '', innerClassName = '' }: Props) {
  if (!interactive) {
    return (
      <article className={`rounded-lg border border-line bg-bg-200 ${className} ${innerClassName}`}>
        {children}
      </article>
    )
  }
  return (
    <article
      className={`group relative rounded-lg bg-line p-px transition-[box-shadow,translate] duration-500 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift focus-within:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
        style={{ background: 'var(--gradient-neon)' }}
      />
      <div className={`relative h-full rounded-[15px] bg-bg-200 ${innerClassName}`}>{children}</div>
    </article>
  )
}
