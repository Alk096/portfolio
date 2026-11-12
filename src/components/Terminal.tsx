import { Fragment } from 'react'
import { terminal } from '../content/about'

/** Le terminal du moniteur 3D en texte : lu sur mobile, par les lecteurs d'écran, et si la 3D échoue. */
export function Terminal({ className = '' }: { className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-lg border border-line bg-bg-200 ${className}`}>
      <figcaption className="border-b border-line px-4 py-3 text-label text-ink-faint normal-case">
        {terminal.title}
      </figcaption>
      <pre className="overflow-x-auto p-4 text-code whitespace-pre-wrap">
        {terminal.lines.map((line) => (
          <Fragment key={line.cmd}>
            <span className="text-mint-text">$ </span>
            <span className="text-ink">{line.cmd}</span>
            {'\n'}
            <span className="text-ink-muted">{line.out}</span>
            {'\n'}
          </Fragment>
        ))}
        <span className="text-mint-text">$ </span>
      </pre>
    </figure>
  )
}
