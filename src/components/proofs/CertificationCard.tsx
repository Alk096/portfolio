import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Circle, CircleCheck, CircleDotDashed, FileText, ShieldCheck, type LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import { formatDate, resolveCertificate, type Certificate } from '../../content/certificateFiles'
import type { Certification, StepState } from '../../content/proofs'
import { Button } from '../Button'
import { Seal } from './Seal'

const stepStates: Record<StepState, { icon: LucideIcon; word: string; tone: string }> = {
  done: { icon: CircleCheck, word: 'Terminé', tone: 'text-mint-text' },
  progress: { icon: CircleDotDashed, word: 'En cours', tone: 'text-violet-text' },
  todo: { icon: Circle, word: 'À planifier', tone: 'text-ink-faint' },
}

type Props = {
  certification: Certification
  onOpenCertificate: (certificate: Certificate) => void
}

/**
 * Carte d'une certification, mise en page comme un document officiel.
 * Tout dépend de `status` : en préparation, rien ne brille et la progression est affichée ;
 * obtenue, le sceau s'allume et les moyens de vérification apparaissent.
 */
export function CertificationCard({ certification, onOpenCertificate }: Props) {
  const root = useRef<HTMLElement>(null)
  const seal = useRef<HTMLDivElement>(null)
  const earned = certification.status === 'earned'

  // Le tampon : le sceau tombe sur la carte, l'impact la fait vibrer, puis il s'allume. Une seule fois.
  useGSAP(
    () => {
      if (!earned) return
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const stamp = seal.current!
        stamp.removeAttribute('data-lit')
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', once: true }, delay: 0.35 })
          .fromTo(
            stamp,
            { autoAlpha: 0, scale: 1.7, rotation: -18 },
            { autoAlpha: 1, scale: 1, rotation: -8, duration: 0.32, ease: 'power4.in' },
          )
          .call(() => stamp.setAttribute('data-lit', ''))
          .fromTo(stamp, { scale: 0.92 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
          .fromTo(root.current, { y: 3 }, { y: 0, duration: 0.35, ease: 'power2.out' }, '<')
        return () => stamp.setAttribute('data-lit', '')
      })
    },
    { scope: root, dependencies: [earned] },
  )

  const certificate = earned ? resolveCertificate(certification.certificate) : null

  return (
    <article
      ref={root}
      aria-labelledby={`${certification.id}-title`}
      className="relative h-full rounded-lg border border-line bg-bg-200 p-1.5"
    >
      {/* Le double filet du document. */}
      <div className="h-full rounded-[11px] border border-line p-5 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-label text-ink-faint">{certification.issuer}</p>
            <h3 id={`${certification.id}-title`} className="mt-3 text-h1 leading-none">
              {certification.name}
            </h3>
            <p className="mt-2 text-body-lg text-ink-muted">{certification.title}</p>
            <p className="mt-4">
              {earned ? (
                <span className="inline-flex h-7 items-center rounded-pill border border-amber-text px-3 text-tag text-amber-text">
                  Obtenue · {formatDate(certification.earnedOn)}
                </span>
              ) : (
                <span className="inline-flex h-7 items-center rounded-pill border border-dashed border-line-strong px-3 text-tag text-ink-muted">
                  Examen à passer
                </span>
              )}
            </p>
          </div>
          <Seal
            ref={seal}
            name={certification.name}
            ring={`${certification.issuer} · ${certification.title} · `}
            caption={earned ? certification.earnedOn.slice(0, 4) : 'À venir'}
            lit={earned}
          />
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <h4 className="text-label text-ink-faint">Domaines de l’examen</h4>
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {certification.domains.map((domain, i) => (
              <li key={domain} className="flex gap-3 text-body-sm">
                <span className="font-mono text-ink-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {domain}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          {certification.status === 'preparing' ? (
            <>
              <h4 className="text-label text-ink-faint">Progression</h4>
              <ol className="mt-3 space-y-2.5">
                {certification.steps.map((step) => {
                  const { icon: Icon, word, tone } = stepStates[step.state]
                  return (
                    <li key={step.label} className="flex items-center gap-3 text-body-sm">
                      <Icon size={18} strokeWidth={1.75} aria-hidden="true" className={`shrink-0 ${tone}`} />
                      <span>{step.label}</span>
                      <span className="ml-auto text-tag text-ink-muted">{word}</span>
                    </li>
                  )
                })}
              </ol>
            </>
          ) : (
            <>
              <dl>
                <dt className="text-label text-ink-faint">Identifiant du certificat</dt>
                <dd className="mt-1.5 text-code break-all">{certification.credentialId}</dd>
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href={certification.verifyUrl} target="_blank" rel="noreferrer">
                  <ShieldCheck size={18} strokeWidth={1.75} aria-hidden="true" />
                  Vérifier
                </Button>
                {certificate && (
                  <button
                    type="button"
                    onClick={() => onOpenCertificate(certificate)}
                    className="inline-flex h-12 items-center gap-2 rounded-pill border border-line-strong px-5 text-body-sm font-medium transition-colors duration-300 hover:bg-bg-300"
                  >
                    <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
                    Certificat
                  </button>
                )}
                {certification.writeupsUrl && (
                  <Button href={certification.writeupsUrl} variant="ghost" target="_blank" rel="noreferrer">
                    Write-ups des labs
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
