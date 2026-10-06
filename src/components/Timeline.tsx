import { milestones } from '@/data/profile'
import { useReveal } from '@/lib/hooks'

export default function Timeline() {
  const { ref, shown } = useReveal<HTMLOListElement>()

  return (
    <section id="timeline" className="section border-b border-line">
      <div className="mb-12">
        <p className="label">
          <span className="text-phos">03</span> / timeline
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Ten months, roughly
        </h2>
      </div>

      <ol ref={ref} className="relative">
        <span
          className="absolute left-[0.4375rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block"
          aria-hidden="true"
        />

        {milestones.map((milestone, index) => (
          <li
            key={milestone.id}
            className={`relative grid gap-2 pb-9 pl-8 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6 ${
              shown ? 'animate-riseIn' : 'opacity-0'
            }`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <span
              className="absolute left-0 top-1.5 grid h-3.5 w-3.5 place-content-center border border-phos bg-void sm:left-0"
              aria-hidden="true"
            >
              <span className="h-1 w-1 bg-phos" />
            </span>

            <span className="text-xs text-phos sm:pt-0.5">{milestone.date}</span>

            <div>
              <h3 className="font-display text-base font-semibold text-fg">{milestone.title}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{milestone.body}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {milestone.tags.map((tag) => (
                  <li key={tag} className="border border-line px-2 py-0.5 text-2xs text-dim">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
