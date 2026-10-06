import { profile } from '@/data/profile'
import { useReveal } from '@/lib/hooks'

export default function Contact() {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section id="contact" className="section border-b border-line">
      <div className="win overflow-hidden">
        <div className="win__bar">
          <span className="win__dot bg-coral/70" />
          <span className="win__dot bg-amber/70" />
          <span className="win__dot bg-phos/70" />
          <span className="win__title">new message</span>
        </div>

        <div
          ref={ref}
          className={`grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] ${shown ? 'animate-riseIn' : 'opacity-0'}`}
        >
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Let's build something
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              I am looking for a frontend or full-stack internship, and I am open to freelance
              work. If you have something that needs building — or something broken that needs
              fixing — send it over.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              I reply to everything, usually within a day.
            </p>
          </div>

          <dl className="space-y-4 self-start font-mono text-xs">
            {profile.email ? (
              <div>
                <dt className="label">email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-phos underline decoration-dotted underline-offset-4 hover:text-fg"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="label">github</dt>
              <dd className="mt-1">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-all text-phos underline decoration-dotted underline-offset-4 hover:text-fg"
                >
                  {profile.github} ↗
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">based in</dt>
              <dd className="mt-1 text-fg">{profile.location}</dd>
            </div>
            <div>
              <dt className="label">status</dt>
              <dd className="mt-1 flex items-center gap-2 text-fg">
                <span className="text-phos" aria-hidden="true">
                  ●
                </span>
                {profile.availability}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
