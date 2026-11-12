import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const next = theme === 'dark' ? 'Jour' : 'Nuit'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Passer au thème ${next}`}
      title={`Thème ${next}`}
      className="grid size-10 place-items-center rounded-pill text-ink-muted transition-colors duration-300 hover:bg-bg-300 hover:text-ink"
    >
      {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  )
}
