import { Hourglass } from 'lucide-react'
import { emptyState } from '../content/categories'

/** Catégorie encore sans contenu : jamais une zone blanche. */
export function EmptyState({ text }: { text: string }) {
  return (
    <div data-tab-item className="flex items-start gap-4 rounded-lg border border-dashed border-line-strong p-6">
      <Hourglass size={22} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-muted" />
      <div>
        <p className="text-h4">{emptyState.title}</p>
        <p className="mt-1 text-body-sm text-ink-muted">{text}</p>
      </div>
    </div>
  )
}
