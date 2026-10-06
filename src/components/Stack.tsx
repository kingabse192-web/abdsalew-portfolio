import { skillGroups, type SkillLevel } from '@/data/profile'
import { useReveal } from '@/lib/hooks'

const LEVELS: Record<SkillLevel, { label: string; bar: string; text: string }> = {
  primary: { label: 'primary', bar: 'bg-phos', text: 'text-phos' },
  working: { label: 'working', bar: 'bg-cyan', text: 'text-cyan' },
  learning: { label: 'learning', bar: 'bg-violet', text: 'text-violet' },
}

function Group({
  group,
  index,
}: {
  group: (typeof skillGroups)[number]
  index: number
}) {
  const { ref, shown } = useReveal<HTMLElement>()

  return (
    <article
      ref={ref}
      className={`win flex flex-col p-5 transition-colors hover:border-line-soft ${
        shown ? 'animate-riseIn' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-line-soft pb-3">
        <h3 className="font-display text-sm font-semibold text-fg">{group.title}</h3>
        <span className="text-2xs text-dim">{group.id}</span>
      </header>

      <p className="mt-3 text-2xs leading-relaxed text-muted">{group.blurb}</p>

      <ul className="mt-4 flex-1 space-y-2.5">
        {group.skills.map((skill) => {
          const level = LEVELS[skill.level]
          return (
            <li key={skill.name}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-fg">
                  {skill.name}
                  {skill.note ? <span className="ml-1.5 text-dim">{skill.note}</span> : null}
                </span>
                <span className={`shrink-0 text-2xs ${level.text}`}>
                  [{level.label}]
                </span>
              </div>
              <div className="mt-1.5 flex gap-[3px]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((tick) => {
                  const filled =
                    skill.level === 'primary' ? tick < 5 : skill.level === 'working' ? tick < 4 : tick < 2
                  return (
                    <span
                      key={tick}
                      className={`h-[3px] flex-1 ${filled ? level.bar : 'bg-line'}`}
                    />
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export default function Stack() {
  return (
    <section id="stack" className="section border-b border-line bg-panel/40">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">
            <span className="text-phos">02</span> / stack
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Tools I actually reach for
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          Levels are honest. <span className="text-phos">primary</span> means I ship with it,{' '}
          <span className="text-cyan">working</span> means I have built real things with it,{' '}
          <span className="text-violet">learning</span> means it is in progress.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Group key={group.id} group={group} index={index} />
        ))}
      </div>
    </section>
  )
}
