import { ArrowUpRight } from 'lucide-react'
import { ctfs, field } from '../../content/proofs'
import { isTodo } from '../../content/todo'
import { Copy } from '../Copy'

const tile = 'rounded-lg border border-line bg-bg-200 p-5 md:p-6'

/** Bloc « Sur le terrain » : le classement et le nombre de CTF, compté depuis le journal. */
export function FieldStats() {
  return (
    <div className="grid h-full gap-4 sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2">
      <div data-entrance="stat" className={`${tile} flex flex-col`}>
        <h3 className="text-label text-ink-faint">{field.platform}</h3>
        <p className="mt-3 text-h1 leading-none tabular-nums">
          <Copy>{field.rank}</Copy>
        </p>
        <p className="mt-2 text-body-sm text-ink-muted">Classement sur {field.platform}</p>
        {!isTodo(field.profileUrl) && (
          <a
            href={field.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-1 self-start rounded-sm pt-4 text-body-sm font-medium underline-offset-4 hover:underline"
          >
            Voir le profil
            <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </a>
        )}
      </div>

      <div data-entrance="stat" className={`${tile} flex flex-col`}>
        <h3 className="text-label text-ink-faint">Compétitions</h3>
        <p className="mt-3 text-h1 leading-none tabular-nums">{ctfs.length}</p>
        <p className="mt-2 text-body-sm text-ink-muted">{ctfs.length > 1 ? 'CTF disputés' : 'CTF disputé'}</p>
        <a
          href="#journal-ctf"
          className="mt-auto inline-flex items-center gap-1 self-start rounded-sm pt-4 text-body-sm font-medium underline-offset-4 hover:underline"
        >
          Voir le journal
        </a>
      </div>
    </div>
  )
}
