import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { CertificateViewer } from '../components/proofs/CertificateViewer'
import { CertificationCard } from '../components/proofs/CertificationCard'
import { CtfLog } from '../components/proofs/CtfLog'
import { FieldStats } from '../components/proofs/FieldStats'
import { SectionHeader } from '../components/SectionHeader'
import type { Certificate } from '../content/certificateFiles'
import { certifications, proofsIntro } from '../content/proofs'
import { sectionEntrance } from '../motion'

export function Proofs() {
  const root = useRef<HTMLElement>(null)
  const [viewing, setViewing] = useState<Certificate | null>(null)

  // La carte se pose d'abord, puis les chiffres du terrain, puis le journal ligne par ligne.
  useGSAP(
    () =>
      sectionEntrance(root.current, (timeline) =>
        timeline
          .from('[data-entrance="title"]', { yPercent: 105, duration: 0.9 })
          .from('[data-entrance="certification"]', { autoAlpha: 0, y: 24, duration: 0.8 }, '-=0.5')
          .from('[data-entrance="stat"]', { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.5')
          .from('[data-entrance="ctf"]', { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.07 }, '-=0.3'),
      ),
    { scope: root },
  )

  return (
    <section ref={root} id="certifications" className="bg-bg-100 py-16 md:py-24">
      <div className="page-container">
        <SectionHeader {...proofsIntro} />

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-12 md:gap-6">
          <div className="space-y-4 md:col-span-8 md:space-y-6">
            {certifications.map((certification) => (
              <div key={certification.id} data-entrance="certification">
                <CertificationCard certification={certification} onOpenCertificate={setViewing} />
              </div>
            ))}
          </div>
          <div className="md:col-span-4">
            <FieldStats />
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <CtfLog onOpenCertificate={setViewing} />
        </div>
      </div>

      <CertificateViewer certificate={viewing} onClose={() => setViewing(null)} />
    </section>
  )
}
