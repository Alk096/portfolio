import { isTodo } from '../content/todo'

/** Un texte du contenu. S'il reste à remplir, il est encadré en pointillés pour sauter aux yeux en développement. */
export function Copy({ children }: { children: string }) {
  if (!isTodo(children)) return children
  return (
    <span className="rounded-sm border border-dashed border-line-strong px-1.5 font-mono text-[0.8em] font-normal tracking-normal text-ink-muted">
      {children}
    </span>
  )
}
