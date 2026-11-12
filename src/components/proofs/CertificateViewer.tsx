import { Download, ExternalLink, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Certificate } from '../../content/certificateFiles'

const action =
  'inline-flex h-10 items-center gap-2 rounded-pill border border-line-strong px-4 text-body-sm font-medium transition-colors duration-300 hover:bg-bg-300'

type Props = {
  certificate: Certificate | null
  onClose: () => void
}

/**
 * Certificat en grand, dans une `<dialog>` native : Échap ferme, le focus reste piégé
 * dans la fenêtre, puis revient au bouton qui l'a ouverte.
 */
export function CertificateViewer({ certificate, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialog.current
    if (!certificate || !element) return
    const opener = document.activeElement as HTMLElement | null
    element.showModal()
    return () => {
      element.close()
      opener?.focus()
    }
  }, [certificate])

  return (
    <dialog
      ref={dialog}
      aria-label={certificate?.alt}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        // Un clic sur le fond (hors du contenu) ferme la fenêtre.
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(64rem,calc(100vw-2rem))] max-w-none rounded-lg border border-line bg-bg-200 p-0 text-ink opacity-100 transition-[opacity,scale] duration-300 ease-out-soft backdrop:bg-bg-000/80 backdrop:backdrop-blur-sm starting:open:scale-95 starting:open:opacity-0 motion-reduce:transition-none"
    >
      {certificate && (
        <div className="flex max-h-[calc(100svh-2rem)] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-5">
            <p className="truncate text-body-sm text-ink-muted">{certificate.alt}</p>
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-300 hover:bg-bg-300"
            >
              <X size={18} strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-bg-000 p-3 md:p-5">
            <img src={certificate.preview} alt={certificate.alt} className="mx-auto h-auto w-full rounded-md" />
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-line px-4 py-3 md:px-5">
            <a href={certificate.original} target="_blank" rel="noreferrer" className={action}>
              <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
              Ouvrir l’original
            </a>
            <a href={certificate.original} download={certificate.fileName} className={action}>
              <Download size={16} strokeWidth={1.75} aria-hidden="true" />
              Télécharger
            </a>
          </div>
        </div>
      )}
    </dialog>
  )
}
