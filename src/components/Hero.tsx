import { banner, facts, profile, promptHost, promptUser } from '@/data/profile'

interface HeroProps {
  booted: boolean
}

export default function Hero({ booted }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,242,77,0.07),transparent_58%)]"
        aria-hidden="true"
      />

      <div id="about" className="section relative pb-24 pt-32 sm:pt-40">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p
              className={`label flex flex-wrap items-center gap-x-2 gap-y-1 ${booted ? 'animate-riseIn' : 'opacity-0'}`}
            >
              <span className="text-phos">●</span>
              <span>{profile.location}</span>
              <span className="text-dim">|</span>
              <span className="text-phos">{profile.availability.toLowerCase()}</span>
            </p>

            <pre
              className={`mt-6 overflow-x-auto text-phos glow ${booted ? 'animate-riseIn' : 'opacity-0'}`}
              style={{ animationDelay: booted ? '80ms' : '0ms' }}
              aria-label="Absalew"
            >
              {banner}
            </pre>

            <h1
              className={`mt-6 max-w-2xl text-balance font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl lg:text-[2.9rem] ${
                booted ? 'animate-riseIn' : 'opacity-0'
              }`}
              style={{ animationDelay: booted ? '160ms' : '0ms' }}
            >
              {profile.role.toLowerCase()}. I build things that{' '}
              <span className="text-phos">actually run</span>.
            </h1>

            <p
              className={`mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base ${
                booted ? 'animate-riseIn' : 'opacity-0'
              }`}
              style={{ animationDelay: booted ? '240ms' : '0ms' }}
            >
              {profile.tagline}
            </p>

            <div
              className={`mt-9 flex flex-wrap items-center gap-3 ${booted ? 'animate-riseIn' : 'opacity-0'}`}
              style={{ animationDelay: booted ? '320ms' : '0ms' }}
            >
              <a href="#projects" className="btn--primary">
                ./projects
              </a>
              <a href="#terminal" className="btn--ghost">
                open terminal
              </a>
              <span className="hidden text-2xs text-dim sm:inline">
                press <kbd className="border border-line px-1.5 py-0.5 text-muted">/</kbd> to focus the shell
              </span>
            </div>
          </div>

          <div
            className={`win self-start ${booted ? 'animate-riseIn' : 'opacity-0'}`}
            style={{ animationDelay: booted ? '400ms' : '0ms' }}
          >
            <div className="win__bar">
              <span className="win__dot bg-coral/70" />
              <span className="win__dot bg-amber/70" />
              <span className="win__dot bg-phos/70" />
              <span className="win__title">{promptUser}@dev:~</span>
            </div>
            <dl className="divide-y divide-line-soft font-mono text-xs">
              {facts.map((fact) => (
                <div key={fact.label} className="flex gap-3 px-4 py-2.5">
                  <dt className="w-24 shrink-0 text-dim">{fact.label}</dt>
                  <dd className="min-w-0 break-all text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-2 border-t border-line-soft px-4 py-3 text-xs">
              <span className="prompt">{promptUser}@{promptHost}</span>
              <span className="text-dim">:~$</span>
              <span className="caret" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
