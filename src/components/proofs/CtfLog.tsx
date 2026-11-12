import { ArrowUpRight, ChevronDown, Download, FileText, Maximize2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { byDateDesc, formatDate, resolveCertificate, type Certificate } from '../../content/certificateFiles'
import { ctfs, type Ctf } from '../../content/proofs'
import { isTodo, showDrafts } from '../../content/todo'
import { Copy } from '../Copy'

const entries = byDateDesc(ctfs).map((ctf, i) => ({
  ctf,
  id: `ctf-${i}`,
  certificate: resolveCertificate(ctf.certificate),
}))

/** Lignes visibles avant « Voir plus ». */
const VISIBLE_ROWS = 3

/** Un champ encore en TODO n'apparaît qu'en développement. */
const filled = (text: string) => showDrafts || !isTodo(text)

const smallAction =
  'inline-flex h-9 items-center gap-1.5 rounded-pill border border-line-strong px-3.5 text-body-sm font-medium transition-colors duration-300 hover:bg-bg-300'

type Props = {
  onOpenCertificate: (certificate: Certificate) => void
}

/** Journal des CTF, du plus récent au plus ancien. Une seule ligne dépliée à la fois. */
export function CtfLog({ onOpenCertificate }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const list = useRef<HTMLOListElement>(null)
  const hidden = entries.length - VISIBLE_ROWS
  const shown = showAll ? entries : entries.slice(0, VISIBLE_ROWS)

  // En dépliant, le focus passe à la première ligne révélée : au clavier, on reprend la lecture là.
  const revealed = useRef(false)
  useEffect(() => {
    if (!revealed.current) return
    revealed.current = false
    list.current?.querySelector<HTMLElement>('[data-first-revealed]')?.focus()
  }, [showAll])

  const toggleAll = () => {
    if (showAll && openId && !entries.slice(0, VISIBLE_ROWS).some((entry) => entry.id === openId)) setOpenId(null)
    revealed.current = !showAll
    setShowAll(!showAll)
  }

  return (
    <div id="journal-ctf" className="scroll-mt-24">
      <h3 className="text-h3">Journal des CTF</h3>
      <ol ref={list} id="journal-ctf-lignes" className="mt-5 border-b border-line">
        {shown.map(({ ctf, id, certificate }, i) => (
          <CtfRow
            key={id}
            id={id}
            ctf={ctf}
            certificate={certificate}
            revealed={i >= VISIBLE_ROWS}
            firstRevealed={i === VISIBLE_ROWS}
            open={openId === id}
            onToggle={() => setOpenId((current) => (current === id ? null : id))}
            onOpenCertificate={onOpenCertificate}
          />
        ))}
      </ol>
      {hidden > 0 && (
        <button
          type="button"
          aria-expanded={showAll}
          aria-controls="journal-ctf-lignes"
          onClick={toggleAll}
          className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-pill border border-line-strong px-4 text-body-sm font-medium transition-colors duration-300 hover:bg-bg-300"
        >
          {showAll ? 'Voir moins' : `Voir plus (${hidden})`}
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className={`transition-transform duration-300 motion-reduce:transition-none ${showAll ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  )
}

type RowProps = {
  id: string
  /** Ligne apparue avec « Voir plus » : elle entre en fondu. */
  revealed: boolean
  firstRevealed: boolean
  ctf: Ctf
  certificate: Certificate | null
  open: boolean
  onToggle: () => void
  onOpenCertificate: (certificate: Certificate) => void
}

function CtfRow({ id, ctf, certificate, revealed, firstRevealed, open, onToggle, onOpenCertificate }: RowProps) {
  // L'aperçu ne se charge qu'à la première ouverture, puis reste en place pour l'animation de fermeture.
  const [opened, setOpened] = useState(false)
  if (open && !opened) setOpened(true)

  const panelId = `${id}-certificat`
  const writeup = ctf.writeupUrl && !isTodo(ctf.writeupUrl) ? ctf.writeupUrl : null

  return (
    <li
      data-entrance={revealed ? undefined : 'ctf'}
      data-first-revealed={firstRevealed ? '' : undefined}
      tabIndex={firstRevealed ? -1 : undefined}
      className={`border-t border-line outline-offset-4 ${revealed ? 'transition-[opacity,translate] duration-500 ease-out-soft starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none' : ''}`}
    >
      <div className="grid gap-x-6 gap-y-2 py-5 md:grid-cols-[10.5rem_1fr_auto] md:items-start">
        <p className="text-label text-ink-faint tabular-nums md:pt-1.5">
          {filled(ctf.date) && (isTodo(ctf.date) ? <Copy>{ctf.date}</Copy> : <time dateTime={ctf.date}>{formatDate(ctf.date)}</time>)}
        </p>

        <div className="min-w-0">
          <h4 className="text-h4">
            {ctf.name}
            {filled(ctf.platform) && (
              <span className="ml-2 font-sans text-body-sm font-normal text-ink-muted">
                <Copy>{ctf.platform}</Copy>
              </span>
            )}
          </h4>
          {filled(ctf.result) && (
            <p className="mt-1.5 text-code text-ink">
              <Copy>{ctf.result}</Copy>
            </p>
          )}
        </div>

        {(certificate || writeup) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 md:mt-0 md:justify-end">
            {certificate && (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={onToggle}
                className={`${smallAction} aria-expanded:border-ink aria-expanded:bg-bg-300`}
              >
                <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
                Certificat
                <ChevronDown
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
                />
              </button>
            )}
            {writeup && (
              <a href={writeup} target="_blank" rel="noreferrer" className={smallAction}>
                Write-up
                <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>

      {certificate && (
        <div
          id={panelId}
          inert={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out-soft motion-reduce:transition-none ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            {opened && (
              <div className="flex flex-col gap-3 pb-6 md:ml-[calc(10.5rem+1.5rem)] md:flex-row md:items-end md:gap-5">
                <button
                  type="button"
                  onClick={() => onOpenCertificate(certificate)}
                  className="group block w-full max-w-md overflow-hidden rounded-md border border-line bg-bg-000"
                >
                  <img
                    src={certificate.preview}
                    alt={certificate.alt}
                    className="h-auto w-full transition-transform duration-500 ease-out-soft group-hover:scale-[1.02] motion-reduce:transition-none"
                  />
                  <span className="sr-only">Agrandir</span>
                </button>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onOpenCertificate(certificate)} className={smallAction}>
                    <Maximize2 size={16} strokeWidth={1.75} aria-hidden="true" />
                    Agrandir
                  </button>
                  <a href={certificate.original} download={certificate.fileName} className={smallAction}>
                    <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                    Télécharger
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
