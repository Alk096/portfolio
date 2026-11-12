import { ArrowUpRight, ImageOff } from 'lucide-react'
import type { Project } from '../content/projects'
import { Card } from './Card'
import { Copy } from './Copy'
import { Tag } from './Tag'

/** Au-delà, les technos restantes sont résumées par « +n ». */
const MAX_TAGS = 3

function Thumbnail({ project, className }: { project: Project; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-bg-300 ${className}`}>
      {project.image ? (
        <img
          src={project.image}
          alt={`Capture du projet ${project.title}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-ink-faint">
          <span className="flex items-center gap-2 text-label normal-case">
            <ImageOff size={18} strokeWidth={1.75} aria-hidden="true" />
            TODO : capture
          </span>
        </span>
      )}
      {project.featured && (
        <span className="absolute top-3 left-3 rounded-pill bg-amber px-2.5 py-0.5 text-tag font-medium text-on-amber uppercase">
          Vedette
        </span>
      )}
      {project.href && (
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-pill border border-line bg-bg-200 text-ink opacity-0 transition-[opacity,translate] duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-safe:translate-y-1 motion-safe:group-hover:translate-y-0"
        >
          <ArrowUpRight size={16} strokeWidth={1.75} />
        </span>
      )}
    </div>
  )
}

/**
 * Vignette 2/1, titre, deux lignes de description, technos. Quand le projet a un lien,
 * il est posé sur le titre et étendu à toute la carte : un seul arrêt de tabulation,
 * et la carte entière répond au toucher. Le projet vedette occupe deux colonnes.
 */
export function ProjectCard({ project }: { project: Project }) {
  const { featured } = project
  const hiddenTags = project.tags.length - MAX_TAGS

  return (
    <Card
      interactive={Boolean(project.href)}
      className="h-full"
      innerClassName={`flex h-full flex-col overflow-hidden ${featured ? 'sm:grid sm:grid-cols-[1.15fr_1fr]' : ''}`}
    >
      <Thumbnail
        project={project}
        className={featured ? 'aspect-[2/1] sm:aspect-auto sm:h-full sm:min-h-56' : 'aspect-[2/1]'}
      />

      <div className={`flex flex-1 flex-col p-4 ${featured ? 'sm:p-6' : ''}`}>
        <h3 className={featured ? 'text-h3' : 'text-h4'}>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:outline-2 focus-visible:after:outline-offset-[3px] focus-visible:after:outline-amber-text"
            >
              <Copy>{project.title}</Copy>
            </a>
          ) : (
            <Copy>{project.title}</Copy>
          )}
        </h3>
        <p className={`mt-1.5 text-body-sm text-ink-muted ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          <Copy>{project.description}</Copy>
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.tags.slice(0, MAX_TAGS).map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
          {hiddenTags > 0 && (
            <li>
              <Tag>+{hiddenTags}</Tag>
            </li>
          )}
        </ul>
      </div>
    </Card>
  )
}
