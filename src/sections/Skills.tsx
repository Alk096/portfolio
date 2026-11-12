import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { CategoryTabs } from '../components/CategoryTabs'
import { Copy } from '../components/Copy'
import { EmptyState } from '../components/EmptyState'
import { SectionHeader } from '../components/SectionHeader'
import { Tag } from '../components/Tag'
import { categories, emptyState, type CategoryId } from '../content/categories'
import { skills, skillsIntro, technologies } from '../content/skills'
import { useTabSwap } from '../hooks/useTabSwap'
import { sectionEntrance } from '../motion'

/** Une liste à deux colonnes séparée par des filets : se lit comme un CV, pas comme une grille de cartes. */
function SkillsPanel({ category }: { category: CategoryId }) {
  const inCategory = skills.filter((skill) => skill.category === category)
  if (inCategory.length === 0) return <EmptyState text={emptyState.skills} />
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2">
      {inCategory.map((skill) => (
        <li key={skill.name} data-tab-item className="border-t border-line py-3.5">
          <h3 className="text-body font-semibold text-ink">
            <Copy>{skill.name}</Copy>
          </h3>
          <p className="mt-0.5 text-body-sm text-ink-muted">
            <Copy>{skill.detail}</Copy>
          </p>
        </li>
      ))}
    </ul>
  )
}

export function Skills() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<CategoryId>(categories[0].id)
  const shown = useTabSwap(root, active)

  // Les filets se tracent de gauche à droite, puis les technos tombent comme une sortie de commande.
  useGSAP(
    () =>
      sectionEntrance(root.current, (timeline) =>
        timeline
          .from('[data-entrance="title"]', { yPercent: 105, duration: 0.8 })
          .from('[role="tablist"]', { autoAlpha: 0, x: 24, duration: 0.6, clearProps: 'transform' }, '-=0.45')
          .from(
            `[data-panel="${active}"] [data-tab-item]`,
            { clipPath: 'inset(0 100% 0 0)', duration: 0.7, stagger: 0.05, clearProps: 'clipPath' },
            '-=0.4',
          )
          .from('[data-entrance="tech"]', { autoAlpha: 0, duration: 0.2, stagger: 0.025 }, '-=0.3'),
      ),
    // L'entrée ne se joue qu'une fois, sur la catégorie affichée au chargement.
    { scope: root, dependencies: [] },
  )

  return (
    <section ref={root} id="skills" className="bg-bg-100 py-12 md:py-16">
      <div className="page-container">
        <SectionHeader {...skillsIntro} />
        <div className="mt-8 md:mt-10">
          <CategoryTabs
            name="skills"
            label="Catégories de compétences"
            side="right"
            active={active}
            onChange={setActive}
            shown={shown}
            renderPanel={(id) => <SkillsPanel category={id} />}
          />
        </div>

        <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-1.5 md:mt-5">
          {technologies.map((tech) => (
            <li key={tech} data-entrance="tech">
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
