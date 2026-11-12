import { ArrowUp } from 'lucide-react'
import { BrandIcon } from '../components/BrandIcon'
import { Button } from '../components/Button'
import { identity, socials } from '../content/site'
import { isTodo, showDrafts } from '../content/todo'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-000 py-6">
      <div className="page-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-body-sm text-ink-muted">
          © {YEAR} {identity.firstName} {identity.lastName}
        </p>
        <ul className="flex flex-wrap gap-3">
          {socials
            .filter((social) => showDrafts || !isTodo(social.href))
            .map((social) => (
              <li key={social.label}>
                {isTodo(social.href) ? (
                  <span className="inline-flex h-12 items-center rounded-pill border border-dashed border-line-strong px-5 text-code text-ink-muted">
                    TODO : {social.label}
                  </span>
                ) : (
                  <Button href={social.href} variant="ghost" target="_blank" rel="noreferrer">
                    <BrandIcon brand={social.brand} size={18} />
                    {social.label}
                  </Button>
                )}
              </li>
            ))}
          <li>
            <Button href="#top" variant="ghost">
              Haut de page
              <ArrowUp size={18} strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </li>
        </ul>
      </div>
    </footer>
  )
}
