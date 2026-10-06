import { projects, type Project } from '@/data/profile'
import { useReveal } from '@/lib/hooks'

const STATUS: Record<Project['status'], { label: string; className: string }> = {
  live: { label: 'live', className: 'border-phos text-phos' },
  active: { label: 'active', className: 'border-cyan text-cyan' },
  shipped: { label: 'shipped', className: 'border-amber text-amber' },
  archived: { label: 'archived', className: 'border-line text-dim' },
}

function Card({ project, index }: { project: Project; index: number }) {
  const { ref, shown } = useReveal<HTMLElement>()
  const status = STATUS[project.status]
  const featured = project.status === 'live'

  return (
    <article
      ref={ref}
      className={`win group relative flex flex-col transition-all duration-300 hover:border-phos/60 hover:shadow-phos ${
        shown ? 'animate-riseIn' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="win__bar">
        <span className="win__dot bg-line" />
        <span className="win__dot bg-line" />
        <span className="win__dot bg-line" />
        <span className="win__title truncate">{project.id}</span>
        <span
          className={`ml-auto shrink-0 border px-1.5 py-0.5 text-2xs uppercase tracking-terminal ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className={`font-display text-lg font-semibold ${featured ? 'text-phos' : 'text-fg'}`}>
            {project.name}
          </h3>
          <span className="text-2xs text-dim">
            {project.kind} · {project.period}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>

        <ul className="mt-4 space-y-1.5 border-l border-line pl-4">
          {project.detail.map((line) => (
            <li key={line} className="relative text-xs leading-relaxed text-muted before:absolute before:-left-[1.3rem] before:text-phos/60 before:content-['▸']">
              {line}
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech} className="border border-line px-2 py-0.5 text-2xs text-muted transition-colors group-hover:border-line">
              {tech}
            </li>
          ))}
        </ul>

        {project.links.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-4 border-t border-line-soft pt-4">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-phos underline decoration-dotted underline-offset-4 hover:text-fg"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section border-b border-line">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">
            <span className="text-phos">01</span> / projects
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            What I have built
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          Five projects, in the order they happened. The stack column is what actually ran — not
          what was planned.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <Card key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
