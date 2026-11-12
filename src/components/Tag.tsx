import type { ReactNode } from 'react'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-pill border border-line bg-bg-100 px-2.5 text-tag text-ink-muted">
      {children}
    </span>
  )
}
