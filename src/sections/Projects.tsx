import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { CategoryTabs } from '../components/CategoryTabs'
import { EmptyState } from '../components/EmptyState'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeader } from '../components/SectionHeader'
import { categories, emptyState, type CategoryId } from '../content/categories'
import { projects, projectsIntro } from '../content/projects'
import { isTodo, showDrafts } from '../content/todo'
import { useTabSwap } from '../hooks/useTabSwap'
import { sectionEntrance } from '../motion'

const published = showDrafts ? projects : projects.filter((project) => !isTodo(project.title))

function ProjectsPanel({ category }: { category: CategoryId }) {
  const inCategory = published.filter((project) => project.category === category)
  if (inCategory.length === 0) return <EmptyState text={emptyState.projects} />
  // Le projet vedette passe en tête et occupe deux colonnes.
  const ordered = [...inCategory].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((project) => (
        <li key={project.title} data-tab-item className={project.featured ? 'sm:col-span-2' : ''}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}

export function Projects() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<CategoryId>(categories[0].id)
  const shown = useTabSwap(root, active)

  // Le rail glisse depuis son bord, puis les vignettes se posent comme des tirages sur une table.
  useGSAP(
    () =>
      sectionEntrance(root.current, (timeline) =>
        timeline
          .from('[data-entrance="title"]', { yPercent: 105, duration: 0.8 })
          .from('[role="tablist"]', { autoAlpha: 0, x: -24, duration: 0.6, clearProps: 'transform' }, '-=0.45')
          .from(
            `[data-panel="${active}"] [data-tab-item]`,
            { autoAlpha: 0, y: 20, scale: 0.97, duration: 0.65, stagger: 0.08, clearProps: 'transform' },
            '-=0.35',
          ),
      ),
    // L'entrée ne se joue qu'une fois, sur la catégorie affichée au chargement.
    { scope: root, dependencies: [] },
  )

  return (
    <section ref={root} id="projets" className="bg-bg-000 py-14 md:py-20">
      <div className="page-container">
        <SectionHeader {...projectsIntro} />
        <div className="mt-8 md:mt-10">
          <CategoryTabs
            name="projets"
            label="Catégories de projets"
            side="left"
            active={active}
            onChange={setActive}
            shown={shown}
            renderPanel={(id) => <ProjectsPanel category={id} />}
          />
        </div>
      </div>
    </section>
  )
}
