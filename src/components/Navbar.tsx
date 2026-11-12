import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { identity, navLinks } from '../content/site'
import type { Theme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

type Props = { theme: Theme; onToggleTheme: () => void }

export function Navbar({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  // Met en avant le lien de la section actuellement à l'écran.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
          else setActive((cur) => (cur === `#${entry.target.id}` ? null : cur))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex h-14 max-w-[720px] items-center justify-between rounded-pill border border-line bg-bg-100/85 pr-2 pl-5 backdrop-blur-md"
      >
        <a
          href="#top"
          aria-label={`${identity.firstName} ${identity.lastName}, retour en haut`}
          className="flex items-baseline gap-1 rounded-sm font-display text-[20px] font-bold tracking-tight text-ink"
        >
          {identity.monogram}
          <span className="size-1.5 rounded-full bg-amber" aria-hidden="true" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`rounded-pill px-3 py-2 text-body-sm transition-colors duration-300 hover:text-ink ${
                    isActive ? 'text-amber-text' : 'text-ink-muted'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-pill text-ink-muted hover:bg-bg-300 hover:text-ink md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="menu-mobile"
          className="mx-auto mt-2 max-w-[720px] rounded-lg border border-line bg-bg-100 p-2 md:hidden"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-4 py-3 text-body text-ink-muted hover:bg-bg-300 hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
